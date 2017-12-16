const _ = require('lodash');
const moment = require('moment');

const shuffleHelper = require('./helper');

const emptyShuffle = { 
    current: null, 
    is_holiday: false,
    is_weekend: false,
    is_workday: false,
    iteration: 0,
    selected: []
};

const getLatestShuffle = async (shuffleRepo, calendarService) => {
    let previous = calendarService.getTodayDate().subtract(1, 'days');
    return await shuffleRepo.getShuffle(previous) || emptyShuffle;
};

const getTodayShuffle = async (shuffleRepo, calendarService, teamService) => {
    let today = calendarService.getTodayDate();

    let todayShuffle = await shuffleRepo.getShuffle(today);
    if (todayShuffle) return todayShuffle;

    let latestShuffle = await getLatestShuffle(shuffleRepo, calendarService);
    let mergedSelected = [...latestShuffle.selected, latestShuffle.current].filter((x) => x);

    let isWeekend = calendarService.isTodayWeekend();
    let isHoliday = calendarService.isTodayHoliday();
    if (isWeekend || isHoliday) {
        return await shuffleRepo.createShuffle(today, {
            current: null,
            is_holiday: isHoliday,
            is_weekend: isWeekend,
            is_workday: false,
            iteration: latestShuffle.iteration,
            selected: mergedSelected
        });
    }

    let teamMembers = await teamService.getTeamMemberNames();

    let isAllParticipated = shuffleHelper.isAllParticipated(teamMembers, mergedSelected);
    let newSelected = isAllParticipated ? [] : [...mergedSelected];
    let newCurrent = shuffleHelper.pickNewParticipant(teamMembers, newSelected);

    return await shuffleRepo.createShuffle(today, { 
        current: newCurrent, 
        is_holiday: false,
        is_weekend: false,
        is_workday: true,
        selected: newSelected,
        iteration: isAllParticipated ? latestShuffle.iteration + 1 : latestShuffle.iteration
    });
};

module.exports = (shuffleRepo, calendarService, teamService) => ({
    getTodayShuffle: _.partial(getTodayShuffle, shuffleRepo, calendarService, teamService)
});
