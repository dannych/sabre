const moment = require('moment');

const apiBaseUrl = process.env.API_URL;
const api = require('./modules/api')(apiBaseUrl);

const token = process.env.SLACK_TOKEN;
const slackService = require('./modules/slack/service')(token);

const calendarRepo = require('./modules/calendar/repository')(api);
const calendarService = require('./modules/calendar/service')(calendarRepo);

const eventRepo = require('./modules/event/repository')(api);
const eventService = require('./modules/event/service')(eventRepo, calendarService);

const shuffleRepo = require('./modules/shuffle/repository')(api);
const shuffleCtrl = require('./modules/shuffle/controller')(shuffleRepo, calendarService, slackService);

const dateFormat = 'YYYY-MM-DD HH:mm (dddd)';

slackService.hears('release', (bot, message) => {
    eventService.getTodayRemainingEvents()
        .then((getTodayRemainingEvents) => {
            bot.reply(message, getTodayRemainingEvents.length ? 'There are still ongoing events' : 'You can release today');
        });
});

slackService.hears('shuffle', (bot, message) => {
    Promise
        .all([
            slackService.getTeamMembers(),
            shuffleCtrl.getTodayShuffle()
        ])
        .then(([members, shuffle]) => {
            let memberDetail = members.find((x) => x.name === shuffle.current);

            bot.reply(message, { attachments: [{
                title: 'Telpon Showroom',
                title_link: 'https://docs.google.com/spreadsheets/d/1BvKTjsvwGVEi6BkSoZjJHGXw3SiDk6q7dsDa_j8No5I/edit?usp=sharing',
                text: `All, mengingat awareness Garasi di lingkungan showroom masih sangat rendah, kita butuh bantuan kalian semua untuk telponin showroom satu persatu nich..\n`,

                fields: [
                    {
                        title: 'Today Assignee',
                        short: true,
                        value: `${memberDetail ? `<@${memberDetail.id}>` : 'nobody'}`
                    },
                    {
                        title: 'Objective',
                        short: false,
                        value: 'Untuk orang yang beruntung tiap harinya diharapkan menghubungi salah satu showroom dan berpura-pura untuk membeli mobil. Jangan lupa mention Garasi.id yach!'
                    },
                    {
                        title: 'Sample Scenario',
                        short: false,
                        value: [
                            '1. Cari 1 merek/tipe mobil di garasi, cth: \"Honda Jazz\"',
                            '2. Setelah keluar list honda jazz, pilih 3 mobil.',
                            '3. Telfon masing2 no penjual  (bisa pake telp kantor ato hp masing) yang ada di car details\n',
                            'Contoh percakapan:',
                            '\ta. Siang pak, saya liat di homepage Garasi nih, ada mobil honda jazz dijual yang tahun xxx warna yyy, ini apa masih ada pak?',
                            '\tb. Itu harga segitu masih bisa nego apa fix ya pak? Harga cash apa kredit',
                            '\tc. Ok, kalo saya mau liat ini alamat lengkapnya dimana ya?',
                            '\td. Makasih pak. Nanti deh hari Sabtu saya kesana ya.'
                        ].join('\n')
                    },
                    {
                        title: 'Attachment',
                        short: false,
                        value: 'https://docs.google.com/spreadsheets/d/1BvKTjsvwGVEi6BkSoZjJHGXw3SiDk6q7dsDa_j8No5I/edit?usp=sharing'
                    }
                ],
                
                footer: 'clara',
                ts: moment().valueOf(),
                
                color: '#009fd0',
                fallback: `Hi, orang yang beruntung hari ini adalah ${memberDetail ? `<@${memberDetail.id}>` : 'nobody'}.`
            }]});
        })
        .catch((e) => {
            console.log(e);
        });
});

module.exports = async (req, res) => {
    let members = await slackService.getTeamMembers();
    return {
        server: moment().format(dateFormat),
        client: moment().utcOffset(7).format(dateFormat),
        members
    };
}
