const _ = require('lodash');
const moment = require('moment');

const getTodayDate = () => moment().utcOffset(7);
const getYesterdayDate = () => getTodayDate().subtract(1, 'days');

const isTodayWeekend = () => {
    let isoWeekday = getTodayDate().isoWeekday();
    return isoWeekday === 6 || isoWeekday === 7;
}

const isTodayHoliday = async (calendarRepository) => {
    let today = getTodayDate();
    let holidays = await calendarRepository.getHolidayDates();
    return !!holidays
        .filter((date) => date.isSame(today, 'day'))
        .length;
}

module.exports = (calendarRepository) => ({
    now: () => moment().utcOffset(7),
    getTodayDate,
    getYesterdayDate,
    isTodayWeekend,
    isTodayHoliday: _.partial(isTodayHoliday, calendarRepository)
});
