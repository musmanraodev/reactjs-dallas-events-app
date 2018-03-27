require('isomorphic-fetch');
require('dotenv').config();

function fetchEventsFromMeetup(req, res, next) {
  let URL = `https://api.meetup.com/`;
  URL += `reactjs-dallas`;
  URL += `/events?&sign=true&photo-host=public`;
  URL += `&page=${req.body.maxResults}`;
  (req.body.sortBy.method !== "BestMatch") && (URL += `&order=${req.body.sortBy.method}&desc=${req.body.sortBy.type}`);
  fetch(URL, {
    method: 'GET'
  }).then((fetchRes) => {
    return fetchRes.json();
  }).then((jsonFetchRes) => {
    if (jsonFetchRes.errors) {
      res.locals.eventsDataFromMeetupAPI = null;
    } else {
      res.locals.eventsDataFromMeetupAPI = jsonFetchRes;
    }
    next();
  }).catch((err) => {
    res.locals.eventsDataFromMeetupAPI = null;
    next();
  });
}

function fetchEventRsvpFromMeetup(req, res, next) {
  let URL = `https://api.meetup.com/reactjs-dallas/events/${req.body.id}/rsvps`;
  fetch(URL, {
    method: 'GET'
  }).then((fetchRes) => {
    return fetchRes.json();
  }).then((jsonFetchRes) => {
    
    if (jsonFetchRes.errors) {
      res.locals.rsvpDataFromMeetupAPI = null;
    } else {
      res.locals.rsvpDataFromMeetupAPI = jsonFetchRes;
    }
    next();
  }).catch((err) => {
    res.locals.rsvpDataFromMeetupAPI = null;
    next();
  });
}

module.exports = {
  fetchEventsFromMeetup,
  fetchEventRsvpFromMeetup
};