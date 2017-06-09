
module.exports = {

    methods: ['textToJSON', 'getUniqueID'],

    definitions: {
        
        textToJSON: {
            summary: 'JSON text parsed to JSON object',
            params: [
                {label: 'text', type: String}
            ]
        },

        getUniqueID: {
            summary: 'Get unique random string id',
            yarn: ['uuid']
        },

        httpRequest: {
            summary: 'HTTP request',
            params: [
                {label: 'url', type: String},
                {label: 'method', type: String, optional: true},
                {label: 'body', type: Object, optional: true
            ],
            yarn: ['axios']
        }

    }

}
