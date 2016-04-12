var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


var config =  {
  entry: "./client/javascripts/app.module.js",
  output: {
    filename: "./client/bundle.js"
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
  { test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel' },
  			{ test: /\.css$/, loader: 'style-loader!css-loader' },
  			{ test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
  			{ test: /\.(woff|woff2)$/, loader:"url?prefix=font/&limit=5000" },
  			{ test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
  			{ test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
        { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader'},
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
