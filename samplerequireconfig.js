/**
 * This is an example of what you need to add to your requireconfig to get hbs! working
 * You will of course need tto adjust this to your own application's needs.
 */

require.config({
  baseUrl:'',
  paths:{
    'jquery':'/libs/jquery/jquery',
    'handlebars':'/libs/handlebars/handlebars.amd',
    'text':'/libs/requirejs-text/text',
    'backbone.stickit':'/libs/stickit/backbone.stickit',
    'underscore':'/libs/underscore/underscore-min',
    'backbone':'/libs/backbone/backbone',
    'dw-backbone':'/libs/dw-backbone/src/base',
    'bon-mot':'/libs/bon-mot/bon-mot'
  },
  shim: {
    handlebars: {
      exports: "Handlebars"
    },
    backbone: {
      exports: "Backbone"
    },
    underscore: {
      exports: "_"
    }
  },
  packages: [{
    // Include hbs as a package, so it will find hbs-builder when needed
    name: "hbs",
    location: "bon-mot/libs/hbs",
    main: "hbs"
  }],
  hbs: {
    templateExtension: ".hbs",
    //compilerPath: "/static/common/handlebars/handlebars-4.0.5",
    compilerPath: "handlebars",
  }
  //You'll note though using a css bundler is a great idea, one is not included in this example,
  //as I've not yet found a solution that I love.
});
