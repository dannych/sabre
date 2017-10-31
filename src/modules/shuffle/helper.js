const _ = require('lodash');

const isAllParticipated = (members, participated) => {
    return _.difference(members, participated).length === 0;
}

const pickNewParticipant = (members, participated) => {
    return _.chain(members).difference(participated).shuffle().head().value();
}

module.exports = {
    isAllParticipated,
    pickNewParticipant
};
