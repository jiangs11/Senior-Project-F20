'''
Stores specific information for informing the service more
deeply about the User

TODO:
Check userId, it may not need primary_key=True

@author Matthew Schofield & Jasdip Dhillon
@version 10.11.2020
'''
# Library imports
# Place holding

# Module imports
from app import db


class ExtendedUser(db.Model):
    '''
    Column definitions
    extendedUserId
    userId
    gender
    age
    uiSatisfaction
    overallSatisfaction
    securitySatisfaction
    locationInterestedInALongitude
    locationInterestedInALatitude
    locationInterestedInBLongitude
    locationInterestedInBLatitude
    tasksPosted
    tasksAccepted
    offersSent
    posterPreference
    pricePerDrivingMinute

    Connections
    User table, userId
    '''
    # Column definitions
    userId = db.Column(db.Integer(), db.ForeignKey("user.userId"), primary_key=True)
    gender = db.Column(db.String(10), nullable=True)
    age = db.Column(db.Integer(), nullable=True)
    uiSatisfaction = db.Column(db.Integer(), nullable=True)
    overallSatisfaction = db.Column(db.Integer(), nullable=True)
    securitySatisfaction = db.Column(db.Integer(), nullable=True)
    locationInterestedInALongitude = db.Column(db.Numeric(9, 6), nullable=True)
    locationInterestedInALatitude = db.Column(db.Numeric(9, 6), nullable=True)
    locationInterestedInBLongitude = db.Column(db.Numeric(9, 6), nullable=True)
    locationInterestedInBLatitude = db.Column(db.Numeric(9, 6), nullable=True)
    tasksPosted = db.Column(db.Integer(), nullable=True)
    tasksAccepted = db.Column(db.Integer(), nullable=True)
    offersSent = db.Column(db.Integer(), nullable=True)
    pricePerDrivingMinute = db.Column(db.Numeric(10, 2), nullable=True)
    posterPreference = db.Column(db.Integer(), nullable=True)

    def setGender(self, newGender):
        self.gender = newGender
        db.session.commit()

    def setAge(self, newAge):
        self.age = newAge
        db.session.commit()

    def setUISatisfaction(self, newUISat):
        self.uiSatisfaction = newUISat
        db.session.commit()

    def setOverallSatisfaction(self, newOverallSat):
        self.overallSatisfaction = newOverallSat
        db.session.commit()

    def setSecuritySatisfaction(self, newSecSat):
        self.securitySatisfaction = newSecSat
        db.session.commit()

    def setLocationInterestedInALongitude(self, newLongitudeA):
        self.locationInterestedInALongitude = newLongitudeA
        db.session.commit()

    def setLocationInterestedInALatitude(self, newLatitudeA):
        self.locationInterestedInALatitude = newLatitudeA
        db.session.commit()

    def setLocationInterestedInALongitude(self, newLongitudeB):
        self.locationInterestedInBLongitude = newLongitudeB
        db.session.commit()

    def setLocationInterestedInALongitude(self, newLatitudeB):
        self.locationInterestedInBLatitude = newLatitudeB
        db.session.commit()

    def setTasksPosted(self, newTasksPosted):
        self.tasksPosted = newTasksPosted
        db.session.commit()

    def setTasksAccepted(self, newTasksAccepted):
        self.tasksAccepted = newTasksAccepted
        db.session.commit()

    def setOffersSent(self, newOffersSent):
        self.offersSent = newOffersSent
        db.session.commit()

    def setPricePerDrivingMinute(self, newPricePerDrivingMinute):
        self.pricePerDrivingMinute = newPricePerDrivingMinute
        db.session.commit()

    def setPosterPreference(self, newPosterPreference):
        self.posterPreference = newPosterPreference
        db.session.commit()

    @classmethod
    def createExtendedUserModel(cls, user):
        '''
        Create an Extended User Model object in the database

        :param user: User connected to
        '''
        # Create Credentials object
        extendedUser = ExtendedUser(user=user)

        # Save to database
        db.session.add(extendedUser)
        db.session.commit()
