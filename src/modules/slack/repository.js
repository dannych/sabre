const _ = require('lodash');
const bluebird = require('bluebird');
const Botkit = require('botkit');

const getWhitelistedNames = (api) => {
    return api.get('/whitelist.json').then((res) => res || []);
}

module.exports = (token, api) => {
    let controller = Botkit.slackbot({});
    let bot = controller.spawn({ 
        token
    }).startRTM();

    const getUserListF = bluebird.promisify(bot.api.users.list);

    const getUserList = () => getUserListF({}).then((res) => res.members);
    
    return {
        getUserList,
        getWhitelistedNames: _.partial(getWhitelistedNames, api),
        listen: _.partial(controller.hears, _.partial.placeholder, ['direct_message', 'direct_mention', 'mention', 'ambient'], _.partial.placeholder)
    };
};