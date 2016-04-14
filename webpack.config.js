var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var PATHS = {
  client: path.join(__dirname, 'client/javascripts/app.module.js'),
  build: path.join(__dirname, 'build'),
  styles: path.join(__dirname, 'client/stylesheets/main.scss')
}

var config =  {
  entry: PATHS.client,
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      ON_TEST: process.env.NODE_ENV === 'test'
    })
  ],
  module: {
    loaders: [
      {
        exclude: /(node_modules|bower_components)/,
        loader: 'ng-annotate!babel?presets=es2015'
      },

  // Load SCSS


      {  test: /\.html$/,
        loader: 'raw',
        exclude: /node_modules/
      }
    ]
  }
}

if(process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config
