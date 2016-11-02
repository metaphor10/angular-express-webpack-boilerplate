/**
 * Module dependencies.
 */
// const path = require("path")
const fs = require("fs")
const express = require("express")
const passport = require("passport")
// const gm = require("gm").subClass({
//   imageMagick: true,
// })

// Load configurations
// Set the node enviornment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || "development"

// Initializing system variables
const mongoose = require("mongoose")
const config = require("../config/config")
_ = require("lodash")

// Bootstrap db connection
const db = mongoose.connect(config.db)

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

const Article = mongoose.model("Article")
// const Vote = mongoose.model("Vote")
const Album = mongoose.model("Album")
// const Conversation = mongoose.model("Conversation")
// const UserEvent = mongoose.model("UserEvent")
// const Parameter = mongoose.model("Parameter")
// const User = mongoose.model("User")
// const Match = mongoose.model("Match")
// const Comment = mongoose.model("Comment")

// const EuroData = require("../server/ressources/euro.json")
// const EuroDataR16 = require("../server/ressources/euro_qf.json")
// const EuroDataQF = require("../server/ressources/euro_qf_2.json")
// const EuroDatasSF = require("../server/ressources/euro_SF.json")
// const EuroDatasFi = require("../server/ressources/euro_Fi.json")

// const getNameOfCountryCode = function(teams, code) {
//   let name = ""
//   _.each(teams, function(team) {
//     if (team.code === code) {
//       name = team.name
//     }
//   })
//
//   return name
// }
//
// const addMatchs = function() {
//   const matchs = EuroDatasFi.matchs
//   const teams = EuroData.teams
//   let currentMatch
//   _.each(matchs, function(match) {
//     currentMatch = new Match(match)
//     currentMatch.save(function(err, _matchObject) {
//       if (err) {
//         console.warn("Error when adding match: " + err)
//       } else {
//         console.warn("Successfuly add match")
//         const homeName = getNameOfCountryCode(teams, match.home)
//         const awayName = getNameOfCountryCode(teams, match.away)
//         const userEvent = new UserEvent({
//           title: homeName + " - " + awayName,
//           type: "inverse",
//           eventType: "other",
//           content: "Match de l'euro 2016 du groupe " + match.type,
//           startsAt: match.startsAt,
//           endsAt: match.startsAt,
//           editable: false,
//           deletable: false,
//           incrementsBadgeTotal: true,
//           guest: [],
//           subType: "euroMatch",
//           matchId: _matchObject._id,
//
//         })
//         userEvent.save(function(err) {
//           if (err) {
//             console.warn("Error when adding userEvent: " + err)
//           } else {
//             console.warn("Successfuly add userEvent")
//           }
//         })
//       }
//     })
//   })
// }
//
// const rotateImage = function() {
//   const oldPath = path.resolve(config.root + "/server/public/img/users/")
//   fs.readdir(oldPath, function(err, items) {
//     if (items) {
//       _.each(items, function(item) {
//         const name = item
//         const newPath = path.resolve(config.root + "/server/public/img/tmp/" + name)
//         gm(path.resolve(config.root + "/server/public/img/users/" + name))
// 					.autoOrient()
// 					.write(newPath, function(err) {
//
//   if (err) {
//     console.log("Error when trying to move new image " + err)
//   } else {
//     console.log("Rotate image ")
//   }
// })
//       })
//
//       console.warn("End process of image traitment!")
//     }
//   })
// }
//
// const reInitEuroPoints = function() {
//   User.find({}).exec(function(err, users) {
//     if (err) {
//       res.render("error", {
//         status: 500,
//       })
//     } else {
//       _.each(users, function(user) {
//         user.euroPoints = 0
//         user.save(function(err) {
//           if (err) {
//             console.warn("error when trying to save user")
//           } else {
//             console.warn("user saved")
//           }
//         })
//       })
//     }
//   })
//
//   Match.find({}).exec(function(err, matchs) {
//     if (err) {
//       res.render("error", {
//         status: 500,
//       })
//     } else {
//       _.each(matchs, function(match) {
//         match.scoresUpdated = undefined
//         match.save(function(err) {
//           if (err) {
//             console.warn("error when trying to save match")
//           } else {
//             console.warn("match saved")
//           }
//         })
//       })
//     }
//   })
// }
//
// const addReadContents = function() {
//   let articleIds = []
//   let albumIds = []
//   let suggestionIds = []
//
//   Article.find().exec(function(err, articles) {
//     articleIds = _.pluck(articles, "_id")
//     Album.find().exec(function(err, albums) {
//       albumIds = _.pluck(albums, "_id")
//       Suggestion.find().exec(function(err, suggestions) {
//         suggestionIds = _.pluck(suggestions, "_id")
//         User.find({}).exec(function(err, users) {
//           if (err) {
//             console.warn("Error")
//           } else {
//             _.each(users, function(user) {
//               user.readArticles = articleIds
//               user.readAlbums = albumIds
//               user.readVotes = suggestionIds
//               user.save(function(err) {
//                 if (err) {
//                   console.warn("error when trying to save user")
//                 } else {
//                   console.warn("user updated")
//                 }
//               })
//             })
//           }
//         })
//       })
//     })
//   })
// }

const changeQuoteToVote = function() {
  Article.find({
    type: "quote",
  }).exec(function(err, articles) {
    _.each(articles, function(article) {
      article.type = "vote"
      article.save(function(err) {
        if (err) {
          console.warn("error when trying to save user")
        } else {
          console.warn("article updated")
        }
      })
    })
  })
}

const migrateAlbums = function() {

  Album.find().exec(function(err, album) {

    if (err) {
      console.warn("Error when to fetch album " + err)
    } else {
      _.each(album, function(album) {

        const article = new Article({
          title: album.name,
          user: album.user,
          content: album.description,
          type: "album",
          comments: [],
          created: album.created,
          photoList: album.photoList,
          coverPicPath: album.coverPicPath,
        })

        article.save(function(err) {

          if (err) {
            console.warn("Error when trying to save new article " + err)
          } else {
            console.warn("Save new article ")
          }
        })
      })
    }
  })
}


// addParameters();
// addMatchs();
// rotateImage();

// reInitEuroPoints();
// addReadContents();
// updateUserScores();

changeQuoteToVote()
migrateAlbums()
