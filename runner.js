
const TEST_FLOW = require('./flows/test-flow.js');

const PLEX = require('./sys/plex.js');
const ACTIONS = PLEX.util.compileActions();

const mockData = {name: 'Derek Newsom', age: 27, job: 'Developer'};

// global value store
let _  = {};

// load trigger info into global context
_.trigger  = {result: mockData};

let run = (nodeId, node) => new Promise((resolve, reject) => {
    let action = PLEX.util.findActionByNodeId(ACTIONS, nodeId);

    if(!action) return reject(`${nodeId} is not an available action`);

    action(_, node.params).then(res => {

        // load return into global context
        _[nodeId] = {result: res};

        // traverse through child action nodes
        node.edges.forEach(edge => {
            let next = TEST_FLOW.nodes[edge];

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
    edge: TEST_FLOW.source,
    node: TEST_FLOW.nodes[TEST_FLOW.source]
};

run(source.edge, source.node).then(result => {

}).catch(reason => {
    console.log(`ERROR: ${reason}`);
});
