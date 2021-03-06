define({

    proxyPort: 9000,

    proxyUrl: 'http://localhost:9000/',

    capabilities: {
        'selenium-version': '2.41.0'
    },

    environments: [
        { browserName: 'internet explorer', version: '11', platform: 'Windows 8.1' },
        { browserName: 'internet explorer', version: '10', platform: 'Windows 8' },
        { browserName: 'internet explorer', version: '9', platform: 'Windows 7' },
        { browserName: 'firefox', version: '28', platform: [ 'OS X 10.9', 'Windows 7', 'Linux' ] },
        { browserName: 'chrome', version: '34', platform: [ 'OS X 10.9', 'Windows 7', 'Linux' ] },
        { browserName: 'safari', version: '6', platform: 'OS X 10.8' },
        { browserName: 'safari', version: '7', platform: 'OS X 10.9' }
    ],

    maxConcurrency: 3,

    useLoader: {
        'host-node': 'dojo/dojo',
        'host-browser': 'node_modules/dojo/dojo.js'
    },

    loader: {
        packages: [ { name: 'sqleditor', location: 'sqleditor' } ]
    },

    suites: ['sqleditor/tests/base64',
             'sqleditor/tests/random',
             'sqleditor/tests/prettyPrinter',
             'sqleditor/tests/fileManagerStore.js'],

    excludeInstrumentation: /^(?:tests|node_modules)\//
});
