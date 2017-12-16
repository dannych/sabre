const _ = require('lodash');

const getAvailableTeamMembers = (slackRepository) => {
    return slackRepository.getUserList()
        .then((res) => res
            .filter((member) => !member.is_bot && member.name !== 'slackbot' && !member.deleted));
};

const getTeamMemberNames = (slackRepository) => {
    return getAvailableTeamMembers(slackRepository)
        .then((members) => members.map((member) => member.name));
}

const getTeamMembers = async (slackRepository) => {
    let whitelist = await slackRepository.getWhitelistedNames();
    let members = await getAvailableTeamMembers(slackRepository);

    return members
        .filter((member) => !whitelist.find((name) => name === member.name));
}

module.exports = (slackRepository) => ({
    listen: slackRepository.listen,
    getTeamMembers: _.partial(getTeamMembers, slackRepository),
    getTeamMemberNames: _.partial(getTeamMemberNames, slackRepository),
    getAvailableTeamMembers: _.partial(getAvailableTeamMembers, slackRepository)
});
