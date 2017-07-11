
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
        }
        
    },
    actions
}
