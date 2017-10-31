const _ = require('lodash');
const moment = require('moment');

const dateKey = 'YYYY-MM-DD';

const addHoliday = (api, date) => {
    return api.put('/holidays' + moment(date).format()); // todo add array
};

const getHolidays = (api) => {
    return api.get('/holidays');
};

module.exports = (api) => ({
    addHoliday: _.partial(addHoliday, api),
    getHolidays: _.partial(getHolidays, api)
});
