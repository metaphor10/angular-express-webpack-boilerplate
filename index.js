const path = require("path")
const nodemon = require("nodemon")
const Webpack = require("webpack")
const WebpackDevServer = require("webpack-dev-server")
const webpackConfig = require("./webpack.config.js")

const host = process.env.APP_HOST || "localhost"
const isProduction = process.env.NODE_ENV === "production"

// We only want to run the workflow when not in production
if (!isProduction) {

  let bundleStart = null
  const compiler = Webpack(webpackConfig)

  compiler.plugin("compile", function() {
    bundleStart = Date.now()
  })

  compiler.plugin("done", function() {
    console.log("webpack: bundled in now valid, build in " + (Date.now() - bundleStart) + "ms!")
  })

  const bundler = new WebpackDevServer(compiler, {
    publicPath: "/dist",
    hot: true,
    quiet: false,
    noInfo: true,
    stats: {
      colors: true,
    },
  })

  bundler.listen(3001, host, function() {
    console.log("wait until bundle finished")
  })

  nodemon({
    execMap: {
      js: "node",
    },
    script: path.join(__dirname, "server/server"),
    watch: !isProduction ? ["server/*"] : false,
    ext: "js",
  }).on("restart", function() {
    console.log("Server restarted!")
  })
}
