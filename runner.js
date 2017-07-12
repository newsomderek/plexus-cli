let flow;

const fs = require('fs');
const Promise = require('bluebird');

const PLEX = require('./sys/plex.js');
const ACTIONS = PLEX.util.compileActions();

// global context value store
let _ = {};

// load any context from file if it exists
try {
    let context = JSON.parse(fs.readFileSync('context.json', 'utf8'));
    Object.assign(_, context);
} catch (err) {

}

// try to load flow details from global context
try {
    if (_.flow) flow = require(_.flow);
} catch (err) {

}

let run = (nodes, flow) => new Promise((resolve, reject) => {

    nodes.forEach(node => {
        let action = PLEX.util.findActionByNodeId(ACTIONS, node.id);

        if (!action) return reject(`${node.id} is not an available action`);

        action(_, node.params)
            .then(result => {
                console.log(`RUN RESULT: ${JSON.stringify(result)}`);

                // load return into global context
                _[node.id] = { result };

                return result;
            })
            .then(result => {

                let edgeNodes = node.edges.map(nodeId => {
                    let composite = { id: nodeId };
                    Object.assign(composite, flow.nodes[nodeId])

                    return composite;
                });

                if (node.isLoop) {

                    Promise.map(result, (item) => {
                        return run(edgeNodes, flow);
                    });

                } else {
                    return run(edgeNodes, flow);
                }
            });

    });

    return resolve({ status: 'success' });

});

if (flow) {

    let source = { id: flow.source };
    Object.assign(source, flow.nodes[flow.source]);

    run([source], flow).then(result => {
        console.log(result.status);
    }).catch(reason => {
        console.log(`ERROR: ${reason}`);
    });

} else {
    console.log('No flow found to execute');
}