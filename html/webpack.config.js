const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {index: './src/index.js', sole: './src/programs/sole/sole.js'},
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
  },
  plugins: [
      new HtmlWebpackPlugin({
          filename: 'index.html',
          template: 'src/index.html',
          inject: false
      }),
      new HtmlWebpackPlugin({
        filename: 'programs/sole/sole.html',
        template: 'src/programs/sole/sole.html',
        inject: false
      })
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
    ],
  },
};