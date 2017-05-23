var webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: './src/app.js',
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: "",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
            path.resolve(__dirname, './src')
        ],
        loader: 'babel-loader',
        query: { presets: [ ['es2015', { "modules": false }], 'react' ] }
      }
    ]
  },
  devServer: {
      port: 8008
  },
  plugins: [
      new webpack.optimize.UglifyJsPlugin({})
    ]
};