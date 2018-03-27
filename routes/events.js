const express = require('express');
const eventsHelpers = require('../services/events/eventsHelpers');

const events = express.Router();

events.post('/events', eventsHelpers.fetchEventsFromMeetup, (req, res) => {
    res.json(res.locals.eventsDataFromMeetupAPI);
});

events.post('/rsvp', eventsHelpers.fetchEventRsvpFromMeetup, (req, res) => {
    res.json(res.locals.rsvpDataFromMeetupAPI);
});

module.exports = events;