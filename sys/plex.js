
let toolbelt = require('./actions/toolbelt');

let actions = {
    toolbelt
};

module.exports = {
    util: {
        compileActions: () => {
            let actionMap = {};

            Object.keys(actions).forEach(pod => {

                Object.keys(actions[pod]).forEach(actionKey => {
                    let action = actions[pod][actionKey];
                    
                    actionMap[actionKey] = actions[`${pod}.${actionKey}`] = action;
                });

            });

            return actionMap;
        },
        
        /*
         * Parse nodeId structure to get the intended node action key for lookup.
         * All node ids should be in the form of {node-key-here}_{unique-id-int-her}.
         * For example: httpRequest_1
         */
        findActionByNodeId: (actionsMap, nodeId) => {
            let actionKey = nodeId.split('_')[0];

            return actionsMap[actionKey];
        }
    },
    actions
}
