const _ = require('lodash');
const moment = require('moment');

const dateKey = 'YYYY-MM-DD';

const placeholder = {
    current: null, 
    is_holiday: false,
    is_weekend: false,
    is_workday: false,
    iteration: 0,
    selected: []
};

const getShuffle = (api, date) => {
    return api.get('/shuffles/' + moment(date).format(dateKey) + '.json')
        .then((res) => res ? { ...placeholder, ...res } : null);
};

const createShuffle = (api, date, data) => {
    return getShuffle(api, date)
        .then((res) => {
            if (res) return Promise.reject(res);
            return api.put('/shuffles/' + moment(date).format(dateKey) + '.json', data)
        })
        .then((res) => res ? { ...placeholder, ...res } : null);
};

module.exports = (api) => ({
    getShuffle: _.partial(getShuffle, api),
    createShuffle: _.partial(createShuffle, api)
});
