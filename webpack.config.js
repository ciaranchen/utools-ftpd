const path = require('path')
const outputPath = path.join(__dirname, 'dist')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  target: 'web',
  mode: 'development',
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: outputPath
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{
        from: 'public',
        to: outputPath
      }]
    })
  ],
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/plugin-proposal-object-rest-spread']
        }
      }
    }, {
      test: /\.(less|css)$/,
      use: [{
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
          options: {
            url: false
          }
        },
        {
          loader: 'less-loader'
        }
      ]
    }]
  }
}
