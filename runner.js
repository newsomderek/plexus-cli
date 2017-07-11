
const TEST_FLOW = require('./flows/test-flow.js');

const fs = require('fs');

const PLEX = require('./sys/plex.js');
const ACTIONS = PLEX.util.compileActions();

// global context value store
let _  = {};

try {
    // load any context from file if it exists
    let context = JSON.parse(fs.readFileSync('contextt.json', 'utf8'));   
    Object.assign(_, context); 
} catch (err) {

}

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
