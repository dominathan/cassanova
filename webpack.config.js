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
    path: PATHS.build,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      ON_TEST: process.env.NODE_ENV === 'test'
    }),
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      title: 'Tindergarten'
    }),
    new CleanWebpackPlugin([PATHS.build]),
  ],
  module: {
    loaders: [
      {
        exclude: /(node_modules|bower_components)/,
        loader: 'ng-annotate!babel?presets=es2015'
      },

  // Load SCSS
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader','css-loader','sass-loader')},
              { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader','css-loader')},
              { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
              { test: /\.(woff|woff2)$/, loader:"url?prefix=font/&limit=5000" },
              { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
              { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },

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
