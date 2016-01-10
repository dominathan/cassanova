module.exports = {
  entry: "./client/app.js",
  output: {
    filename: "public/bundle.js"
  },
  module: {
    loaders: [
      {
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }, {
        test: /\.css$|\.scss$/, // Only .css files
        loader: 'style!css!sass' // Run both loaders
      }
    ]
  }
}
