const _ = require('lodash');
const fetch = require('node-fetch');

const get = (baseUrl, url) => {
    return fetch(baseUrl + url)
        .then((res) => res.json());
}

const post = (baseUrl, url, body) => {
    return fetch(baseUrl + url, { method: 'POST', body: JSON.stringify(body) })
        .then((res) => res.json());
}

const put = (baseUrl, url, body) => {
    return fetch(baseUrl + url, { method: 'PUT', body: JSON.stringify(body) })
        .then((res) => res.json());
}

module.exports = (baseUrl) => ({
    get: _.partial(get, baseUrl),
    post: _.partial(post, baseUrl),
    put: _.partial(put, baseUrl)
});