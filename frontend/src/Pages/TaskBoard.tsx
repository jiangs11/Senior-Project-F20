import React, { useEffect, useState, useContext } from 'react';
import Navigation from '../Components/Navigation';
import { Button, Col, Container, Navbar, Row, UncontrolledCollapse, Form, FormGroup, Input, Label } from 'reactstrap';
import { Field, Formik } from 'formik';
import Footer from "../Components/Footer";
import axios from 'axios';
import TaskCard from '../Components/TaskCard';
import { TileLayer, MapContainer, useMap, useMapEvents } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import MapsCircle from '../Components/MapsCircle';
import APIContext from '../Contexts/APIContext';

type task = {
    taskId: number,
    categoryId: number,
    recommendedPrice: string,
    amount: number,
    estimatedDurationMinutes: number,
    locationALatitude: number,
    locationALongitude: number,
    title: string,
    posterTaskId: number,
    description: string,
    startDate: string
}

type location = {
    lowerLat: number,
    lowerLong: number,
    upperLat: number,
    upperLong: number
}

const TaskBoard = () => {
    const url = useContext(APIContext);
    const token = localStorage.getItem('access_token');

    let a: task[] = [];

    const [tasks, setTasks] = useState(a);
    var [lowerLat, setLowerLat] = useState<number>(39.702550);
    var [lowerLong, setLowerLong] = useState<number>(-75.112005);
    var [upperLat, setUpperLat] = useState<number>(39.702550);
    var [upperLong, setUpperLong] = useState<number>(-75.112005);

    const center: LatLngTuple = [lowerLat, lowerLong]
    const tempCenter: LatLngTuple = [39.702550, -75.112005]
    const current_url = new URL(window.location.href);

    const cur_lata = current_url.search.split('\&')[4]?.substring(9);
    const cur_longa = current_url.search.split('\&')[5]?.substring(10);
    const cur_latb = current_url.search.split('\&')[6]?.substring(9);
    const cur_longb = current_url.search.split('\&')[7]?.substring(10);
    const cur_lat = (Number(cur_lata) + Number(cur_latb)) / 2
    const cur_long = (Number(cur_longa) + Number(cur_longb)) / 2
    const centerLocation: LatLngTuple = cur_lat ? [Number(cur_lat), Number(cur_long)] : [39.702550, -75.112005];

    const getTaskList = async () => {
        const pageURL = window.location.href
        
        // Check if the current page url contains query parameters
        if (pageURL.includes('?')) {
            searchPostedTask(pageURL)
        }
        else {
            await axios.get(url + 'task/recommendTasks',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setTasks(response.data.tasks);
                var current_url = new URL(pageURL)
            })
            .catch(error => {
                console.log(error);
            });
        }
    }

    const searchPostedTask = async (pageURL) => {
        // Takes http://localhost:3000/tasks?title=rake&categoryId=2&duration=30 and turns into
        // title=rake&categoryId=2&duration=30
        const queryParams = pageURL.substring(pageURL.indexOf('?') + 1, pageURL.length)

        // Array[title=rake, categoryId=2, duration=30]
        const arrayOfParams = queryParams.split('&')

        const title = arrayOfParams[0].substring(arrayOfParams[0].indexOf('=') + 1, arrayOfParams[0].length)
        const categoryID = arrayOfParams[1].substring(arrayOfParams[1].indexOf('=') + 1, arrayOfParams[1].length)
        const minPrice = arrayOfParams[2].substring(arrayOfParams[2].indexOf('=') + 1, arrayOfParams[2].length)
        const maxPrice = arrayOfParams[3].substring(arrayOfParams[3].indexOf('=') + 1, arrayOfParams[3].length)
        const lowerLat = arrayOfParams[4].substring(arrayOfParams[4].indexOf('=') + 1, arrayOfParams[4].length)
        const lowerLong = arrayOfParams[5].substring(arrayOfParams[5].indexOf('=') + 1, arrayOfParams[5].length)
        const upperLat = arrayOfParams[6].substring(arrayOfParams[6].indexOf('=') + 1, arrayOfParams[6].length)
        const upperLong = arrayOfParams[7].substring(arrayOfParams[7].indexOf('=') + 1, arrayOfParams[7].length)


        const queryString = {}
        if (title !== '') {
            queryString["title"] = {"contains": title}
        }
        if (categoryID !== '0') {
            queryString["categoryId"] = {"==": categoryID}
        }
        queryString["recommendedPrice"] = {">=": Number(minPrice), "<=": Number(maxPrice)}

        queryString["location"] = {"within": 
            [lowerLat, upperLat, lowerLong, upperLong]
        }

        await axios.post(url + 'task/searchPostedTasks', {
            max: 20,
            query: queryString
        },
            {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                console.log('new filtered tasks: ', response.data)
                setTasks(response.data.tasks)
            })
            .catch(error => {
                console.log(error);
            });
    }

    const getIds = async () => {
        await axios.get(url + 'task/getPublic',
            { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    function ChangeView() {
        const map = useMap()

        const mapEvent = useMapEvents({
            move: () => {
                const bound = map.getBounds()
                setLowerLat(bound.getSouthWest().lat)
                setLowerLong(bound.getSouthWest().lng)
                setUpperLat(bound.getNorthEast().lat)
                setUpperLong(bound.getNorthEast().lng)
            }
        })
        return null
    }
      

    useEffect(() => {
        getTaskList();
        console.log(centerLocation)
    }, []);


    const isMobile = window.innerWidth < 1000;

    return (
        <div>
            <Navigation />

            { isMobile ?
                <div>
                    {/* Search Bar */}
                    <Navbar id="refineToggler" className="centered" color="#bbbbbb" style={{ backgroundColor: "#bbbbbb" }} light expand="sm">
                        <h4 className="centered" style={{ fontWeight: "bold" }} id="top">Refine Options</h4>
                    </Navbar>
                    <UncontrolledCollapse toggler="#refineToggler">
                        <div className="centered" style={{background: "#d6d6d6", height: "auto"}}>
                            <Formik initialValues={{ categoryId: 0, title: "", duration: 0, minPrice: 0, maxPrice: 999, lowerLat: 42, lowerLong: 50, upperLat: 20, upperLong: 80 }} onSubmit={(data) => console.log(data)}>
                                <Form inline style={{margin: '1rem'}} >
                                    {/* Title Search Bar */}
                                    <FormGroup>
                                        <Label for="search"><h5><b>Search&nbsp;</b></h5></Label>{' '}
                                        <Field type="text" name="search" id="search" placeholder="Task Title" maxLength={24} as={Input}/>
                                    </FormGroup>

                                    {/* Select Task Category */}
                                    <FormGroup>
                                        <Label for="categoryId"><h5>&nbsp;&nbsp;&nbsp;<b>Task Category&nbsp;</b></h5></Label>
                                        <Field type="select" name="categoryId" as={Input}>
                                            <option value="0" selected>Select Category</option>
                                            <option value="1">Yard Work</option>
                                            <option value="2">Transportation</option>
                                            <option value="3">Cleaning</option>
                                            <option value="4">Moving</option>
                                            <option value="5">Care-Taking</option>
                                            <option value="6">Cooking</option>
                                        </Field>
                                    </FormGroup>

                                    {/* Select Min/Max Price */}
                                    <FormGroup>
                                        <Label for="minPrice"><h5>&nbsp;&nbsp;&nbsp;<b>Min Price&nbsp;</b> </h5></Label>
                                        <Field type="text" name="minPrice" id="minPrice" placeholder="$" min="15" max="999" style={{width: 50}} as={Input} />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label for="maxPrice"><h5>&nbsp;&nbsp;&nbsp;<b>Max Price&nbsp;</b> </h5></Label>
                                        <Field type="text" name="maxPrice" id="maxPrice" placeholder="$$$" min="15" max="999" style={{width: 50}} as={Input} />
                                    </FormGroup>

                                    <FormGroup>
                                        {/* <Label for="maxPrice"><h5>&nbsp;&nbsp;&nbsp;<b>Max Price&nbsp;</b> </h5></Label> */}
                                        <Field type="hidden" name="lowerLat" id="lowerLat" value={lowerLat} as={Input} />
                                        <Field type="hidden" name="lowerLong" id="lowerLong" value={lowerLong} as={Input} />
                                        <Field type="hidden" name="upperLat" id="upperLat" value={upperLat} as={Input} />
                                        <Field type="hidden" name="upperLong" id="upperLong" value={upperLong} as={Input} />
                                    </FormGroup>

                                    {/* Submit Button */}
                                    &nbsp;&nbsp;&nbsp;
                                    <Button color="danger" type="submit">Refine Search</Button>
                                </Form>
                            </Formik>
                        </div>
                    </UncontrolledCollapse>

                    {/* Map */}
                    <MapContainer className="leaflet-container" center={centerLocation} style={{ height: window.innerWidth / 2 }} zoom={10} scrollWheelZoom={true} >
                        {/* <ChangeView center={tempCenter}/> */}
                        <TileLayer
                            url="https://api.mapbox.com/styles/v1/sanchezer1757/cki7qwrxp2vlt1arsifbfcccx/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2FuY2hlemVyMTc1NyIsImEiOiJja2k3cXUzbzExbDNtMnRxc2NlZnFnenJ2In0.zCSSQC8m87qtzSpfQS7Y8A"
                            attribution='<a href="/">OddJobs</a> | <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a>'
                        />

                        {/* Map Circle Markers - MapsCircle */}
                        {tasks.map(task => (
                            <MapsCircle
                                key={task.taskId}
                                title={task.title}
                                id={task.taskId}
                                categoryId={task.categoryId}
                                offerer={task.posterTaskId}
                                price={Number(task.recommendedPrice)}
                                duration={task.estimatedDurationMinutes}
                                latitude={Number(task.locationALatitude)}
                                longitute={Number(task.locationALongitude)}
                                startDate={task.startDate}
                                description={task.description} />
                        ))}

                    </MapContainer>

                    {/* Tasks */}
                    <Container >
                        <h3 className="centered" style={{ fontWeight: 'bolder' }}>Tasks</h3>
                        <hr />
                        {tasks.map(task => (
                            <TaskCard
                                key={task.taskId}
                                id={task.taskId}
                                title={task.title}
                                offerer={task.posterTaskId}
                                price={Number(task.recommendedPrice)}
                                description={task.description}
                                duration={task.estimatedDurationMinutes}
                                startDate={task.startDate}
                                categoryId={task.categoryId}
                            />
                        ))}

                        <hr />
                        <h4 className="centered" style={{ fontWeight: 'bolder' }}>No More Tasks in this Area</h4>&nbsp;
                        <Button className={'task centered'} href="#top">Back to Top</Button>

                        <br />

                    </Container>
                </div>

                :

                <div>
                    {/* Search Bar */}
                    <div className="centered" style={{background: "#d6d6d6", height: "auto"}}>
                        <Formik initialValues={{ categoryId: 0, title: "", duration: 0, minPrice: 0, maxPrice: 999, lowerLat: 42, lowerLong: 50, upperLat: 20, upperLong: 80 }} onSubmit={(data) => console.log(data)}>
                            <Form inline style={{margin: '1rem'}} >
                                {/* Title Search Bar */}
                                <FormGroup>
                                    <Label for="search"><h5><b>Search&nbsp;</b></h5></Label>{' '}
                                    <Field type="text" name="search" id="search" placeholder="Task Title" as={Input}/>
                                </FormGroup>

                                {/* Select Task Category */}
                                <FormGroup>
                                    <Label for="categoryId"><h5>&nbsp;&nbsp;&nbsp;<b>Task Category&nbsp;</b></h5></Label>
                                    <Field type="select" name="categoryId" as={Input}>
                                        <option value="0" selected>Select Category</option>
                                        <option value="1">Yard Work</option>
                                        <option value="2">Transportation</option>
                                        <option value="3">Cleaning</option>
                                        <option value="4">Moving</option>
                                        <option value="5">Care-Taking</option>
                                        <option value="6">Cooking</option>
                                    </Field>
                                </FormGroup>

                                {/* Select Min/Max Price */}
                                <FormGroup>
                                    <Label for="minPrice"><h5>&nbsp;&nbsp;&nbsp;<b>Min Price&nbsp;</b> </h5></Label>
                                    <Field type="text" name="minPrice" id="minPrice" placeholder="$" min="15" max="999" style={{width: 50}} as={Input} />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="maxPrice"><h5>&nbsp;&nbsp;&nbsp;<b>Max Price&nbsp;</b> </h5></Label>
                                    <Field type="text" name="maxPrice" id="maxPrice" placeholder="$$$" min="15" max="999" style={{width: 50}} as={Input} />
                                </FormGroup>

                                <FormGroup>
                                    <Field type="hidden" name="lowerLat" id="lowerLat" value={lowerLat} as={Input} />
                                    <Field type="hidden" name="lowerLong" id="lowerLong" value={lowerLong} as={Input} />
                                    <Field type="hidden" name="upperLat" id="upperLat" value={upperLat} as={Input} />
                                    <Field type="hidden" name="upperLong" id="upperLong" value={upperLong} as={Input} />
                                </FormGroup>

                                {/* Submit Button */}
                                &nbsp;&nbsp;&nbsp;
                                <Button color="danger" type="submit">Refine Search</Button>
                            </Form>
                        </Formik>
                    </div>

                    {/* Page */}
                    <Row style={{height: '85vh'}}>
                        {/* Left - TaskCards */}
                        <Col xs="3" style={{ height: '85vh', overflowY: "scroll" }}>
                            <Container >
                                <h3 id="top" className="centered" style={{ fontWeight: 'bolder' }}>Tasks</h3>
                                <hr />
                                {tasks.map(task => (
                                    <TaskCard
                                        key={task.taskId}
                                        id={task.taskId}
                                        title={task.title}
                                        offerer={task.posterTaskId}
                                        price={Number(task.recommendedPrice)}
                                        description={task.description}
                                        duration={task.estimatedDurationMinutes}
                                        startDate={task.startDate}
                                        categoryId={task.categoryId}
                                    />
                                ))}

                                <hr />
                                <h4 className="centered" style={{ fontWeight: 'bolder' }}>No More Tasks in this Area</h4>&nbsp;
                                <Button className={'task centered'} href="#top">Back to Top</Button>

                                <br />
                            </Container>

                        </Col>

                        <Col xs="9">
                            <MapContainer className="leaflet-container" center={centerLocation} style={{ height: '85vh' }} zoom={10} scrollWheelZoom={true} >
                                <ChangeView />
                                <TileLayer
                                    url="https://api.mapbox.com/styles/v1/sanchezer1757/cki7qwrxp2vlt1arsifbfcccx/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2FuY2hlemVyMTc1NyIsImEiOiJja2k3cXUzbzExbDNtMnRxc2NlZnFnenJ2In0.zCSSQC8m87qtzSpfQS7Y8A"
                                    attribution='<a href="/">OddJobs</a> | <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a>'
                                />

                                {/* Map Circle Markers - MapsCircle */}
                                {tasks.map(task => (
                                    <MapsCircle
                                    key={task.taskId}
                                    title={task.title}
                                    id={task.taskId}
                                    categoryId={task.categoryId}
                                    offerer={task.posterTaskId}
                                    price={Number(task.recommendedPrice)}
                                    duration={task.estimatedDurationMinutes}
                                    latitude={Number(task.locationALatitude)}
                                    longitute={Number(task.locationALongitude)}
                                    startDate={task.startDate}
                                    description={task.description} />
                                ))}

                            </MapContainer>
                        </Col>
                    </Row>
                </div>
            }
            <Footer />
        </div>
    );
}

export default TaskBoard;