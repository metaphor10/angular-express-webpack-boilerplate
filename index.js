const path = require("path")
const nodemon = require("nodemon")

const isProduction = process.env.NODE_ENV === "production"

// We only want to run the workflow when not in production
if (!isProduction) {

  // We require the bundler inside the if block because
  // it is only needed in a development environment.
  const bundle = require("./bundler.js")

  bundle()
}

nodemon({
  execMap: {
    js: "node",
  },
  script: path.join(__dirname, "server/server"),
  ignore: [],
  watch: !isProduction ? ["server/*"] : false,
  ext: "js",
}).on("restart", function() {
  console.log("Server restarted!")
})
