
const uuidV4 = require('uuid/v4');
const axios = require('axios');

module.exports = {

    textToJSON: (_, {text=''}) => new Promise((resolve, reject) => {
        return resolve(JSON.parse(text));
    }),

    getUniqueID: (_) => new Promise((resolve, reject) => {
        return resolve(uuidV4());
    }),

    httpRequest: (_, {url, method='get', body={}}) => new Promise((resolve, reject) => {
        axios.get(url).then(res => {
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        });
    }),

    textTemplate: (_, {template, data}) => new Promise((resolve, reject) => {
        var tpl = eval('`' + template + '`');
        return resolve(tpl);
    })
        
}
