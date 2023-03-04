export default {
    runner: 'local',
    specs: [
        '../test/specs/**/*.js'
    ],
    logLevel: 'error',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    framework: 'mocha',
    reporters: [ 'spec' ],
    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },
}
