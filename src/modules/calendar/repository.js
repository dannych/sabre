const _ = require('lodash');
const moment = require('moment');

const dateKey = 'YYYY-MM-DD';

const addHolidayDate = (api, date, title) => {
    return api.put('/holidays/' + moment(date).format(), { title: title || 'holiday' });
};

const getHolidayDates = (api) => {
    return api.get('/holidays.json')
        .then((res) => res || {})
        .then((res) => Object.keys(res).map((date) => moment(date, dateKey)));
};

module.exports = (api) => ({
    addHolidayDate: _.partial(addHolidayDate, api),
    getHolidayDates: _.partial(getHolidayDates, api)
});
