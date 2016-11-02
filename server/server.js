const path = require("path")
const fs = require("fs")
const express = require("express")
const httpProxy = require("http-proxy")
const passport = require("passport")
const mongoose = require("mongoose")

const proxy = httpProxy.createProxyServer()
const isProduction = process.env.NODE_ENV === "production"
const host = process.env.APP_HOST || "localhost"
const port = isProduction ? 80 : 3000
const db = mongoose.connection

const publicPath = path.join(__dirname, "../src/public/")
const routesPath = __dirname + "/routes"
const modelsPath = __dirname + "/models"

const walk = function(path, app, withPasseport) {
  fs.readdirSync(path).forEach(function(file) {
    const newPath = path + "/" + file
    const stat = fs.statSync(newPath)
    if (stat.isFile()) {
      if (/(.*)\.(js$)/.test(file) && withPasseport) {
        require(newPath)(app, passport)
      }
      if (/(.*)\.(js$)/.test(file)) {
        require(newPath)
      }
    } else if (stat.isDirectory() && file !== "middlewares") {
      walk(newPath)
    }
  })
}

walk(modelsPath)

// Bootstrap passport config
require("./passport")(passport)

const app = express()

require("./express")(app, passport)

walk(routesPath, app, true)

if (!isProduction) {
  app.all(["/dist/*", "*.hot-update.json"], function(req, res) {
    proxy.web(req, res, {
      target: "http://" + host + ":3001",
    })
  })

  proxy.on("error", function() {
    console.log("Could not connect to proxy, please try again...")
  })
}

app.get("/*", function(req, res) {
  res.sendFile(path.join(publicPath, "index.html"))
})

// mongoose.connect("mongodb://localhost/mean-dev", {server:{auto_reconnect:true}}, function(err) {
//   if (err) {
//     console.error("\x1b[31m", "Could not connect to MongoDB!")
//     console.log(err)
//   }  else {
//     app.listen(port, function() {
//       console.log("Express app started on port " + port)
//     })
//   }
// })

app.listen(port, function() {
  console.log("Express app started on port " + port)
})
