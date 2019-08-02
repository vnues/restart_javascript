const a = require("./a.js");
console.log(a); //{ a: [Function] }

console.log(module);
/*
Module {
  id: '.',
  exports: {},
  parent: null,
  filename:
   '/Users/vnues/restart_javascript/restart_javascript/Underscore周期二学习/模块化/b.js',
  loaded: false,
  children:
   [ Module {
       id:
        '/Users/vnues/restart_javascript/restart_javascript/Underscore周期二学习/模块化/a.js',
       exports: [Object],
       parent: [Circular],
       filename:
        '/Users/vnues/restart_javascript/restart_javascript/Underscore周期二学习/模块化/a.js',
       loaded: true,
       children: [],
       paths: [Array] } ],
  paths:
   [ '/Users/vnues/restart_javascript/restart_javascript/Underscore周期二学习/模块化/node_modules',
     '/Users/vnues/restart_javascript/restart_javascript/Underscore周期二学习/node_modules',
     '/Users/vnues/restart_javascript/restart_javascript/node_modules',
     '/Users/vnues/restart_javascript/node_modules',
     '/Users/vnues/node_modules',
     '/Users/node_modules',
     '/node_modules' ] }
*/
