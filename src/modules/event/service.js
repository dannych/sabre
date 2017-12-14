const _ = require('lodash');

const dateKey = 'YYYY-MM-DD';

const parse = (hourMinute) => {
    let result = { hour: 0, minute: 0};
    let [hour, minute] = hourMinute.split(':');
    return { ...result, hour, minute };
}

const getTodayEvents = async (eventRepository, calendarService) => {
    let events = await eventRepository.getEvents();
    let today = calendarService.getTodayDate();

    let todayEvents = events[today.format(dateKey)];

    return todayEvents ? todayEvents : [];
}

const getTodayRemainingEvents = async (eventRepository, calendarService) => { 
    let todayEvents = await getTodayEvents(eventRepository, calendarService);
    let now = calendarService.now();

    return todayEvents.filter((event) => {
        return event.end.isAfter(now);
    });
}

const getTodayLatestEvent = async (eventRepository, calendarService) => {
    let todayEvents = await getTodayEvents(eventRepository, calendarService);

    if (!todayEvents.length) {
        return null;
    }

    return todayEvents.reduce((event, latestEvent) => {
        let { end } = event;
        let { end: latestEnd } = latestEvent;

        if (event.end.isAfter(latestEnd)) {
            return event;
        }

        return latestEvent;
    });
}

module.exports = (eventRepository, calendarService) => ({
    getTodayEvents: _.partial(getTodayEvents, eventRepository, calendarService),
    getTodayLatestEvent: _.partial(getTodayLatestEvent, eventRepository, calendarService),
    getTodayRemainingEvents: _.partial(getTodayRemainingEvents, eventRepository, calendarService)
});
