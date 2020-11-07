import React from 'react';
import { Button, Container } from 'reactstrap';
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import LandingPage from './Pages/LandingPage';
import ProfilePage from './Pages/ProfilePage';
import ErrorPage from './Pages/ErrorPage';
import SurveyPage from './Pages/SurveyPage';
import TaskBoard from './Pages/TaskBoard';
import ListingPage from './Pages/ListingPage';
import EditPage from './Pages/EditPage';
import TestingPage from './Pages/TestingPage';
import AdminLogin from './Pages/AdminLogin';
import AdminDashboard from './Pages/AdminDashboard';
import AdminUsers from './Pages/AdminUsers';
import AdminTasks from './Pages/AdminTasks';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact={true} path="/" render={(props) => <LandingPage />} />
        <Route exact={true} path="/survey" render={(props) => <SurveyPage />} />
        {/* <Route exact={true} path="/tasks" render={(props) => <TaskBoard />} /> */}
        <Route exact={true} path="/profile" render={(props) => <ProfilePage />} />
        <Route exact={true} path="/error" render={(props) => <ErrorPage />} />
        <Route exact={true} path="/listtask" render={(props) => <ListingPage />} />
        <Route exact={true} path="/admin" render={(props) => <AdminLogin />} />
        <Route exact={true} path="/adminDash" render={(props) => <AdminDashboard />} />
        <Route exact={true} path="/adminUsers" render={(props) => <AdminUsers />} />
        <Route exact={true} path="/adminTasks" render={(props) => <AdminTasks />} />
        <Route exact={true} path="/testing" render={(props) => <TestingPage />} />
        <Redirect to="/error" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
