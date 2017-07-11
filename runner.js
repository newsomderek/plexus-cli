
let flow;

const fs = require('fs');

const PLEX = require('./sys/plex.js');
const ACTIONS = PLEX.util.compileActions();

// global context value store
let _  = {};

// load any context from file if it exists
try {    
    let context = JSON.parse(fs.readFileSync('context.json', 'utf8'));   
    Object.assign(_, context); 
} catch (err) {

}

// try to load flow details from global context
try {    
    if(_.flow) flow = require(_.flow);
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
            let next = flow.nodes[edge];

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

if(flow) {
    
    let source = {
        edge: flow.source,
        node: flow.nodes[flow.source]
    };

    run(source.edge, source.node).then(result => {

    }).catch(reason => {
        console.log(`ERROR: ${reason}`);
    });
    
} else {
    console.log('No flow found to execute');
}