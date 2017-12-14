const _ = require('lodash');
const moment = require('moment');

const getEvents = (api) => {
    return api.get('/events.json')
        .then((res) => {
            let result = {};
            
            Object.keys(res).map((key) => {
                let value = res[key];
                result[key] = value.map((event) => ({
                    ...event,
                    start: moment().utcOffset(7).hour(event.start.hour).minute(event.start.minute || 0),
                    end: moment().utcOffset(7).hour(event.end.hour).minute(event.end.minute || 0)
                }))
            });

            return result;
        });
};

module.exports = (api) => ({
    getEvents: _.partial(getEvents, api)
});
