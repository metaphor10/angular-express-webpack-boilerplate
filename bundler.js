"use strict"

const Webpack = require("webpack")
const WebpackDevServer = require("webpack-dev-server")
const webpackConfig = require("./webpack.config.js")

const host = process.env.APP_HOST || "localhost"

module.exports = function() {

  // First we fire up Webpack an pass in the configuration we
  // created
  let bundleStart = null
  const compiler = Webpack(webpackConfig)

  // We give notice in the terminal when it starts bundling and
  // set the time it started
  compiler.plugin("compile", function() {
    console.log("compile...")
    bundleStart = Date.now()
  })

  // We also give notice when it is done compiling, including the
  // time it took. Nice to have
  compiler.plugin("done", function() {
    console.log("webpack: bundled in now valid, build in " + (Date.now() - bundleStart) + "ms!")
  })

  const bundler = new WebpackDevServer(compiler, {

    // We need to tell Webpack to serve our bundled application
    // from the assets path. When proxying:
    // http://localhost:3000/assets -> http://localhost:8080/assets
    publicPath: "/dist",

    // Configure hot replacement
    hot: true,

    // The rest is terminal configurations
    quiet: false,
    noInfo: true,
    stats: {
      colors: true,
    },
  })

  // We fire up the development server and give notice in the terminal
  // that we are starting the initial bundle
  bundler.listen(3001, host, function() {
    console.log("wait until bundle finished")
  })
}
