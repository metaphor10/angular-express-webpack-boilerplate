const path = require("path")
const express = require("express")
const httpProxy = require("http-proxy")
const fs = require("fs")

const proxy = httpProxy.createProxyServer()
const app = express()

const isProduction = process.env.NODE_ENV === "production"
const host = process.env.APP_HOST || "localhost"
const port = isProduction ? 8080 : 3000
const publicPath = path.resolve(__dirname, "..", "app/public")

if (!isProduction) {
  // Any requests to localhost:3000/assets is proxied
  // to webpack-dev-server
  app.all(["/dist/*", "*.hot-update.json"], function(req, res) {
    proxy.web(req, res, {
      target: "http://" + host + ":3001",
    })
  })
}

app.use(express.static(publicPath))

// place your handlers here
app.get("/*", function(req, res) {
  res.sendFile(path.join(publicPath, "index.html"))
})

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on("error", function(e) {
  console.log("Could not connect to proxy, please try again...", e)
})

app.listen(port, function() {
  console.log("Server running on port " + port)
})
