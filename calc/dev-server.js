'use strict';

var webpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var config = require('./webpack.config.js');
config.entry.unshift("webpack-dev-server/client?http://localhost:8080/");
config.entry.unshift("webpack/hot/dev-server");

var compiler = webpack(config);
var server = new webpackDevServer(compiler, {
  hot : true,
  contentBase : "./",

  quiet : false,
  //proxy : {
  //  '*' : 'http://localhost:8081'
  //},
  stats : { colors : true },
  publicPath : '/static/',
  watch : true,
  //headers : { "X-Custom-Header" : "yes" }
});

server.listen(8080);

