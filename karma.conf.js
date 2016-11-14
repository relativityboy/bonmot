// Karma configuration
// Generated on Sun Nov 13 2016 15:14:06 GMT-0600 (CST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'requirejs', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      'test-main.js',
      //{pattern: 'node_modules/**/*.js', included: false},
      {pattern: 'node_modules/underscore/**/*.js', included: false},
      {pattern: 'node_modules/backbone/**/*.js', included: false},
      {pattern: 'node_modules/jquery/**/*.js', included: false},
      {pattern: 'node_modules/handlebars/**/*.js', included: false},
      {pattern: 'node_modules/text/**/*.js', included: false},
      {pattern: 'node_modules/backbone.stickit/backbone.stickit.js', included: false},
      {pattern: 'node_modules/dw-backbone/**/*.js', included: false},
      {pattern: 'node_modules/requirejs-text/**/*.js', included: false},
      {pattern: 'node_modules/bonmot/**/*.js', included: false},
      {pattern: 'node_modules/sinon/**/*.js', included: false},
      {pattern: 'dist/**/*.js', included: false},
      {pattern: 'test/resources/**/*', included: false},
      {pattern: 'test/**/*', included: false}
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
