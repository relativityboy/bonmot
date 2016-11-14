var allTestFiles = []
var TEST_REGEXP = /(spec|test)\.js$/i

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(function (file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    var normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '')
    allTestFiles.push(normalizedTestModule)
  }
})

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  // dynamically load all test files
  deps: allTestFiles,

  paths: {
    'chai':  'node_modules/chai/chai',
    'sinon': 'node_modules/sinon/pkg/sinon',
    'underscore': 'node_modules/underscore/underscore',
    'jquery':'node_modules/jquery/dist/jquery',
    'handlebars':'node_modules/handlebars/dist/handlebars.amd',
    'text':'node_modules/requirejs-text/text',
    'stickit':'node_modules/backbone.stickit/backbone.stickit',
    'backbone':'node_modules/backbone/backbone',
    'dw-backbone':'node_modules/dw-backbone/src/base',
    'bonmot':'dist/bonmot'
  },
  packages: [{
    // Include hbs as a package, so it will find hbs-builder when needed
    name: "hbs",
    location: "dist/libs",
    main: "hbs"
  }],
  hbs: {
    templateExtension: ".hbs",
    //compilerPath: "/static/common/handlebars/handlebars-4.0.5",
    compilerPath: "handlebars",
  },

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
})
