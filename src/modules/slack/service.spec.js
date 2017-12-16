const slackServiceFactory = require('./service');

describe('Slack Service', () => {

    let slackService;

    let getWhitelistedNames;
    let getUserList;

    let stubGetWhitelistedNames = (data) => {
        getWhitelistedNames.mockReturnValue(Promise.resolve(data));
    };

    let stubGetUserList = (data) => {
        getUserList.mockReturnValue(Promise.resolve(data.map(x => ({ name: x }))));
    }

    describe('getTeamMembers', () => {

        let getTeamMembers = () => {
            return slackService.getTeamMembers().then((x) => x.map((y) => y.name));
        }

        describe('should not filter anything', () => {

            it('has empty whitelist', async () => {
                stubGetWhitelistedNames([]);
                stubGetUserList(['member1', 'member2']);
    
                let member = await getTeamMembers();
    
                expect(member).toEqual(['member1', 'member2']);
            });

            it('has different whitelist', async () => {
                stubGetWhitelistedNames(['member3']);
                stubGetUserList(['member1', 'member2']);
    
                let member = await getTeamMembers();
    
                expect(member).toEqual(['member1', 'member2']);
            });

        });

        describe('should filter whitelisted name', () => {

            it('has whitelist', async () => {
                stubGetWhitelistedNames(['member1']);
                stubGetUserList(['member1', 'member2']);
    
                let member = await getTeamMembers();
    
                expect(member).toEqual(['member2']);
            });

        });

    });

    beforeAll(() => {
        getWhitelistedNames = jest.fn();
        getUserList = jest.fn();

        slackService = slackServiceFactory({
            getWhitelistedNames,
            getUserList
        });

    });

});