var webpack = require('webpack');

var config =  {
  entry: "./client/javascripts/app.module.js",
  output: {
    filename: "./client/bundle.js"
  },
  plugins: [new webpack.DefinePlugin({
    ON_TEST: process.env.NODE_ENV === 'test'
  })],
  module: {
    loaders: [
      {
        exclude: /(node_modules|bower_components)/,
        loader: 'ng-annotate!babel?presets=es2015'
      }, {
        exclude: /(node_modules|bower_components)/,
        test: /\.css$|\.scss$/, // Only .css files
        loader: 'style!css!sass' // Run both loaders
      }, {
        test: /\.html$/,
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
