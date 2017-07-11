
const testFlow = require('./flows/test-flow.js');
const PLEX = require('./sys/plex.js');

const mockData = {name: 'Derek Newsom', age: 27, job: 'Developer'};

// global value store
let _  = {};

// load trigger info into global context
_.trigger  = {result: mockData};

let findAction = (nodeId) => {
    let actions = PLEX.util.compileActions();
    let actionKey = nodeId.split('_')[0];

    return actions[actionKey];
};

let run = (nodeId, node) => new Promise((resolve, reject) => {
    let action = findAction(nodeId);
    let params = node.params || [];
    
    if(!action) return reject(`${nodeId} is not an available action`);

    action(_, params[0]).then(res => {

        // load return into global context
        _[nodeId] = {result: res};

        // traverse through child action nodes
        node.edges.forEach(edge => {
            let next = testFlow.nodes[edge];

            if(!next) return;

            run(edge, next).then(result => {
                console.log(`RUN RESULT: ${JSON.stringify(result)}`);
            }).catch(reason => {
                console.log(`RUN ERROR: ${reason}`);  
            });
        });

        return resolve(res);
    });

});

let source = {
    edge: testFlow.source,
    node: testFlow.nodes[testFlow.source]
};

run(source.edge, source.node).then(result => {

}).catch(reason => {
    console.log(`ERROR: ${reason}`);
});
