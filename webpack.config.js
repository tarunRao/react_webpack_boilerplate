const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const cleanWebpackPlugin = new CleanWebpackPlugin(['dist']);

module.exports = (env, argv) => {
  
  const htmlWebpackPlugin = new HtmlWebPackPlugin({
    inject: false,
    hash: true,
    template: "./src/index.html",
    filename: "./index.html"
  });
  
  const miniCssExtractPlugin = new MiniCssExtractPlugin({
    filename: argv.mode !== 'production' ? 'style.css' : '[name].[chunkhash].css',
    chunkFilename: "[id].css",
    disable: false,
    allChunks: true
  });

  const optimization = argv.mode !== 'production' ? { } : {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }

  return {
    entry: { main: './src/index.js' },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: argv.mode !== 'production' ? 'main.js' : '[name].[chunkhash].js'
    },
    optimization: optimization,
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            argv.mode !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: "[name]_[local]_[hash:base64]",
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [require('autoprefixer')({
                  'browsers': ['> 1%', 'last 2 versions']
                })],
              }
            },
            {
              loader: "sass-loader",
              options: {
                outputStyle: 'expanded',
                sourceMap: true,
                sourceMapContents: true
              }
            }
          ]
        }
      ]
    },
    plugins: [cleanWebpackPlugin, htmlWebpackPlugin, miniCssExtractPlugin],
    devtool: 'source-map'
  }
};
