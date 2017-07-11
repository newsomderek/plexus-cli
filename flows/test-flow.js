
module.exports = {

    name: 'Test Flow One',
    summary: 'Just testing the waters',
    trigger: 'http',
    source: 'httpRequest_1',
    nodes: {
        'httpRequest_1': { params: {url: 'http://api.icndb.com/jokes/random'}, edges: ['getUniqueID_1']},
        'getUniqueID_1': { params: {}, edges: ['textTemplate_1'] },
        'textTemplate_1': {params: {template: "(${_.getUniqueID_1.result}) Joke: ${_.httpRequest_1.result.value.joke}"}, edges: []}
    }

}
