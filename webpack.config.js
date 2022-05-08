const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const templateContent = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Taras Zakharchenko</title><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body><div id="app"></div></body>
</html>`;

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.tsx',
  output: {
    filename: 'app.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { test: /\.(png|jpe?g|gif)$/i, loader: 'file-loader' },
      { test: /\.codegen$/i, loader: 'parcel-codegen-loader' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent,
    }),
    new CopyPlugin({
      patterns: [
        { from: "static_data", to: "static_data" },
      ],
    }),
  ],
};
