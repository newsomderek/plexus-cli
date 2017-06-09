
const testFlow = require('./flows/test-flow.js');
const PLEX = require('./sys/plex.js');

const mockData = {name: 'Derek Newsom', age: 27, job: 'Developer'};

// global value store
let _  = {};

// load trigger info into global context
_.trigger  = {result: mockData};

let compileActions = (plex) => {
    let actions = {};

    Object.keys(plex).forEach(pod => {

        Object.keys(plex[pod]).forEach(actionKey => {
            let action = plex[pod][actionKey];
            
            actions[actionKey] = actions[`${pod}.${actionKey}`] = action;
        });

    });

    return actions;
}

let findAction = (nodeId, node) => {
    let actions = compileActions(PLEX);
    let actionKey = nodeId.split('_')[0];

    return actions[actionKey];
};


let run = (nodeId, node) => new Promise((resolve, reject) => {
    let action = findAction(nodeId, node);
    let params = node.params || [];
    
    if(action) {

        action(_, params[0]).then(res => {

            // load return into global context
            _[nodeId] = {result: res};

            // traverse through child action nodes
            node.edges.forEach(edge => {
                let next = testFlow.nodes[edge];

                if(next) {
                    run(edge, next).then(result => {
                        console.log(`RUN RESULT: ${JSON.stringify(result)}`);
                    }).catch(reason => {
                        console.log(`RUN ERROR: ${reason}`);  
                    });
                }
            });

            return resolve(res);

        });

    } else {
        return reject(`${nodeId} is not an available action`);
    }

});

let source = {
    edge: testFlow.source,
    node: testFlow.nodes[testFlow.source]
};

run(source.edge, source.node).then(result => {

}).catch(reason => {
    console.log(`ERROR: ${reason}`);
});
