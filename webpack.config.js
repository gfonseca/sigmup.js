const path = require('path');
const webpack = require('webpack');
const liveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
  context: path.resolve(__dirname, 'sigmupjs'),
  entry: {
    app: './app.js',
  },
  output: {
    path: path.resolve(__dirname, '/dist'),
    filename: '[name].bundle.js',
  },
  devServer: {
    contentBase: __dirname  ,
    compress: true,
    hot: true,
    inline: true, // live reload
    host: '0.0.0.0',
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['env'] },
        }],
      },
    ],
  },
  plugins: [
    new liveReloadPlugin({
      port: 35729
    })
  ]
};
