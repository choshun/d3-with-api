var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../src/client/app.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack Angular 1.5 Seed - inspired from kitconcept https://github.com/kitconcept/webpack-starter-angular/',
      template: path.resolve(__dirname, '../src/client/index.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/
      },
      {
        test: /\.scss$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap']
      },
      {
        test: /\.html$/, loader: 'raw'
      },
    ]
  },
};
