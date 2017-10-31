const _ = require('lodash');
const bluebird = require('bluebird');
const Botkit = require('botkit');

module.exports = (token) => {
    let controller = Botkit.slackbot({});
    let bot = controller.spawn({ 
        token
    }).startRTM();

    const getUserListF = bluebird.promisify(bot.api.users.list);
    const getTeamMembers = () => {
        return getUserListF({})
            .then((res) => res.members
                .filter((member) => !member.is_bot && member.name !== 'slackbot' && !member.deleted));
    };

    const getTeamMemberNames = () => {
        return getTeamMembers()
            .then((members) => members.map((member) => member.name));
    }

    return {
        getTeamMembers,
        getTeamMemberNames,
        hears: _.partial(controller.hears, _.partial.placeholder, ['direct_message', 'direct_mention', 'mention', 'ambient'], _.partial.placeholder)
    };
};
