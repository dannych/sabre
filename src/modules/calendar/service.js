const _ = require('lodash');
const moment = require('moment');

const getTodayDate = () => moment().utcOffset(7);
const getYesterdayDate = () => getTodayDate().subtract(1, 'days');

const isTodayWeekend = () => {
    let isoWeekday = getTodayDate().isoWeekday();

    console.log(getTodayDate().format());
    console.log(isoWeekday);
    return isoWeekday === 6 || isoWeekday === 7;
}

const isTodayHoliday = (calendarRepository) => {
    return false;
}

module.exports = (calendarRepository) => ({
    getTodayDate,
    getYesterdayDate,
    isTodayWeekend,
    isTodayHoliday: _.partial(isTodayHoliday, calendarRepository)
});
