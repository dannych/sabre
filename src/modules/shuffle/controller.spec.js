const moment = require('moment');

const shuffleCtrlFactory = require('./controller');

describe('Shuffle Controller', () => {

    let shuffleCtrl;
    
    let startingDate;
    let memberNames;

    let isTodayWeekend;
    let isTodayHoliday;

    let getShuffle;

    let stubIsTodayWeekend = (isWeekend) => {
        isTodayWeekend.mockReturnValue(isWeekend);
    };

    let stubIsTodayHoliday = (isHoliday) => {
        isTodayHoliday.mockReturnValue(isHoliday);
    };

    let stubTodayShuffle = (shuffle) => {
        getShuffle.mockReturnValueOnce(shuffle);
    }

    let stubPreviousShuffle = (shuffle) => {
        getShuffle.mockReturnValueOnce(shuffle);
    }

    describe('getTodayShuffle', () => {

        let expectedIteration = 0;
        let expectedIsHoliday = false;
        let expectedIsWeekend = false;
        let expectedIsWorkday = false;
        let expectedCurrent = null;
        let expectedSelected = [];

        describe('already shuffled', () => {

            let todayShuffle = {};

            it('should display the shuffle on workday', () => {
                todayShuffle = {
                    current: 'member1', 
                    is_holiday: false,
                    is_weekend: false,
                    is_workday: true,
                    iteration: 0,
                    selected: [], 
                };
            });

            it('should display the shuffle on weekend', () => {
                todayShuffle = {
                    current: null, 
                    is_holiday: false,
                    is_weekend: true,
                    is_workday: false,
                    iteration: 0,
                    selected: [], 
                };
            });

            it('should display the shuffle on holiday', () => {
                todayShuffle = {
                    current: null, 
                    is_holiday: true,
                    is_weekend: false,
                    is_workday: false,
                    iteration: 0,
                    selected: [], 
                };
            });

            afterEach(() => {
                stubTodayShuffle(todayShuffle);
                
                expectedIteration = todayShuffle.iteration;
                expectedIsHoliday = todayShuffle.is_holiday;
                expectedIsWeekend = todayShuffle.is_weekend;
                expectedIsWorkday = todayShuffle.is_workday;
                expectedCurrent = todayShuffle.current;
                expectedSelected = todayShuffle.selected;
            });

        });

        describe('today is workday', () => {

            beforeEach(() => {
                expectedCurrent = expect.stringMatching(/^member[1-5]$/);                
                expectedIsHoliday = false;
                expectedIsWeekend = false;
                expectedIsWorkday = true;
                expectedIteration = 0
                expectedSelected = [];

                stubIsTodayHoliday(expectedIsHoliday);
                stubIsTodayWeekend(expectedIsWeekend);
                stubTodayShuffle(null);
            });


            it('is the first time', () => {
                stubPreviousShuffle(null);
            });

            it('is the first time after holiday', () => {
                stubPreviousShuffle({
                    current: null, 
                    is_holiday: true,
                    is_weekend: false,
                    is_workday: false,
                    iteration: 0,
                    selected: [], 
                });
            });

            it('is the first time after weekend', () => {
                stubPreviousShuffle({
                        current: null, 
                        is_holiday: false,
                        is_weekend: true,
                        is_workday: false,
                        iteration: 0,
                        selected: [], 
                    });
            });

            it('is the second time', () => {
                stubPreviousShuffle({
                    current: 'member1', 
                    is_holiday: false,
                    is_weekend: false,
                    is_workday: true,
                    iteration: 0,
                    selected: [], 
                });

                expectedIteration = 0;
                expectedSelected = ['member1'];
            });

            it('is the second time after holiday', () => {
                stubPreviousShuffle({
                    current: null, 
                    is_holiday: true,
                    is_weekend: false,
                    is_workday: false,
                    iteration: 0,
                    selected: ['member1'], 
                });

                expectedIteration = 0;
                expectedSelected = ['member1'];
            });

            it('is the second time after weekend', () => {
                stubPreviousShuffle({
                    current: null, 
                    is_holiday: false,
                    is_weekend: true,
                    is_workday: false,
                    iteration: 0,
                    selected: ['member1'], 
                });

                expectedIteration = 0;
                expectedSelected = ['member1'];
            });

            it('is going to second iteration', () => {
                stubPreviousShuffle({
                    current: 'member5', 
                    is_holiday: false,
                    is_weekend: false,
                    is_workday: true,
                    iteration: 0,
                    selected: ['member1', 'member2', 'member3', 'member4'], 
                });

                expectedIteration = 1;
                expectedSelected = [];
            });

            it('is the second on second iteration', () => {
                stubPreviousShuffle({
                    current: 'member1', 
                    is_holiday: false,
                    is_weekend: false,
                    is_workday: true,
                    iteration: 1,
                    selected: [], 
                });

                expectedIteration = 1;
                expectedSelected = ['member1'];
            });

        });

        describe('today is weekend', () => {

            beforeEach(() => {
                expectedCurrent = null;
                expectedIsHoliday = false;
                expectedIsWeekend = true;
                expectedIsWorkday = false;
                expectedIteration = 0
                expectedSelected = [];

                stubIsTodayHoliday(expectedIsHoliday);
                stubIsTodayWeekend(expectedIsWeekend);
                stubTodayShuffle(null);                
            });

            it('is the first time', () => {
                stubPreviousShuffle(null);
            });

            it('is the first time after holiday', () => {
                stubPreviousShuffle({
                    current: null, 
                    is_holiday: true,
                    is_weekend: false,
                    is_workday: false,
                    iteration: 0,
                    selected: [], 
                });
            });

            it('is the first time after weekend', () => {
                stubPreviousShuffle({
                    current: null, 
                    is_holiday: false,
                    is_weekend: true,
                    is_workday: false,
                    iteration: 0,
                    selected: [], 
                });
            });

            it('is the second time', () => {
                stubPreviousShuffle({
                    current: 'member1', 
                    is_holiday: false,
                    is_weekend: false,
                    is_workday: true,
                    iteration: 0,
                    selected: [],
                });

                expectedSelected = ['member1'];
            });

        });

        describe('today is holiday', () => {

            beforeEach(() => {
                expectedCurrent = null;
                expectedIsHoliday = true;
                expectedIsWeekend = false;
                expectedIsWorkday = false;
                expectedIteration = 0
                expectedSelected = [];

                stubIsTodayHoliday(expectedIsHoliday);
                stubIsTodayWeekend(expectedIsWeekend);
                stubTodayShuffle(null);                
            });
            

            it('is the first time', () => {
                stubPreviousShuffle(null);
            });

            it('is the first time after holiday', () => {
                stubPreviousShuffle({
                    current: null, 
                    is_holiday: true,
                    is_weekend: false,
                    is_workday: false,
                    iteration: 0,
                    selected: [], 
                });
            });

            it('is the first time after weekend', () => {
                stubPreviousShuffle({
                    current: null, 
                    is_holiday: false,
                    is_weekend: true,
                    is_workday: false,
                    iteration: 0,
                    selected: [], 
                });
            });

            it('is the second time', () => {
                stubPreviousShuffle({
                    current: 'member1', 
                    is_holiday: false,
                    is_weekend: false,
                    is_workday: true,
                    iteration: 0,
                    selected: [],
                });

                expectedSelected = ['member1'];
            });

        });

        beforeAll(() => {
            startingDate = '2017-10-28T16:15:29+07:00';
            memberNames = [
                'member1',
                'member2',
                'member3',
                'member4',
                'member5',
            ];

            isTodayWeekend = jest.fn();
            isTodayHoliday = jest.fn();
        
            getShuffle = jest.fn();

            shuffleCtrl = shuffleCtrlFactory({
                getShuffle,
                createShuffle: (x, y) => Promise.resolve(y)
            }, {
                getTodayDate: jest.fn().mockReturnValue(moment(startingDate)),
                isTodayHoliday,
                isTodayWeekend,
            }, {
                getTeamMemberNames: jest.fn().mockReturnValue(memberNames)
            });
        });

        afterEach(() => {
            return shuffleCtrl.getTodayShuffle().then((todayShuffle) => {
                expect(todayShuffle).toMatchObject({
                    current: expectedCurrent,
                    is_holiday: expectedIsHoliday,
                    is_weekend: expectedIsWeekend,
                    is_workday: expectedIsWorkday,
                    iteration: expectedIteration,
                    selected: expect.arrayContaining(expectedSelected)
                });

                expect(todayShuffle.selected).toHaveLength(expectedSelected.length);
                todayShuffle.selected.forEach((prev, i) => {
                    expect(prev).toBe(expectedSelected[i]);
                    expect(prev).not.toBe(todayShuffle.current);
                });
            });
        });

    });

});
