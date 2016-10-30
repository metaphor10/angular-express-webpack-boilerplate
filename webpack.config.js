const path = require("path")
const Webpack = require("webpack")
const StatsPlugin = require("stats-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const postcssImport = require("postcss-import")
const postcssUrl = require("postcss-url")
const postcssCssnext = require("postcss-cssnext")

const isProduction = process.env.NODE_ENV === "production"
const host = process.env.APP_HOST || "localhost"
const entryPath = path.resolve(__dirname, "src/app/", "app.js")
const buildPath = path.resolve(__dirname, "dist")

const config = {
  devtool: (isProduction) ? "source-map" : "eval",
  entry: (isProduction) ? entryPath :[
    // For hot style updates
    "webpack/hot/dev-server",
    // The script refreshing the browser on none hot updates
    "webpack-dev-server/client?http://" + host + ":3001",
    // Our application
    entryPath,
  ],
  output: {
    path: buildPath,
    filename: "script.js",
    publicPath: "/",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel?compact=false", "eslint"],
      },
      {
        test: /\.json$/,
        loaders: [
          "json",
        ],
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          "style",
          "css",
          "postcss?from=src/assets/stylesheets/*.css"),
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.(ico|jpe?g|png|gif)$/,
        loader: "file-loader",
      },
    ],
  },
  postcss: (loader) => {
    return [
      postcssImport({
        addDependencyTo: loader,
        path: ["src/assets/style"],
      }),
      postcssUrl,
      postcssCssnext,
    ]
  },
}

if (isProduction) {
  config.plugins = [
    new ExtractTextPlugin("[name].[hash].css"),
    new Webpack.optimize.UglifyJsPlugin({minimize: true}),
    new StatsPlugin(path.join(__dirname, "stats.json"), {chunkModules: true}),
  ]
} else {
  config.plugins = [
    // We have to manually add the Hot Replacement plugin when running from Node
    new ExtractTextPlugin("[name].[hash].css", {disable: !isProduction}),
    new Webpack.HotModuleReplacementPlugin(),
  ]
}

module.exports = config
