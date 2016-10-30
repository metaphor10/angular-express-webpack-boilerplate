const mongoose = require("mongoose")
const _ = require("underscore")

const Match = mongoose.model("Match")
const User = mongoose.model("User")

exports.match = function(req, res, next) {
  Match.findOne({
    _id: req.params.id,
  })
		.populate("bets.user", "_id name username avatar")
		.populate("comments.user", "_id name username avatar")
		.populate("comments.replies.user", "_id name username avatar")
		.populate("user", "_id name username avatar")
		.exec(function(err, match) {
  if (err) return next(err)
  req.match = match
  next()
})
}

exports.findAllMatchs = function(req, res) {

  const query = (req.query.endedMatch === "true") ? {
    startsAt: {
      "$lt": new Date(),
    },
  } : {}

  Match.find(query)
		.sort("startsAt")
		.populate("bets.user", "_id name username avatar")
		.populate("user", "_id name username avatar")
		.exec(function(err, matchs) {
  res.send(matchs)
})
}

exports.findMatchById = function(req, res) {
  Match.findOne({
    _id: req.params.id,
  })
		.populate("bets.user", "_id name username avatar")
		.populate("comments.user", "_id name username avatar")
		.populate("comments.replies.user", "_id name username avatar")
		.populate("user", "_id name username avatar")
		.exec(function(err, match) {
  if (err) console.log("error finding match: " + err)
  res.send(match)
})
}

exports.addMatch = function(req, res) {
  const newMatch = req.body
  newMatch.user = req.user
  Match.create(newMatch, function(err, match) {
    if (err) console.log("error: " + err)
    res.send(match)
  })
}

exports.deleteMatch = function(req, res) {
  Match.findById(req.params.id, function(err) {
    if (!err) {
      res.send(req.body)
    } else {
      console.log("error: " + err)
    }
  })
}

const getPointsFromMatch = function(match, user) {

  const GOOD_SCORE = 5
  const GOOD_WINNER = 2
  const ACCEPTED_GOAL_DIFFERENCE = 1

	/* Winner code:
	 1 for home team
	 2 for away team
	 -1 for nul score
	*/

  let points = 0
  const scoreHome = match.scoreHome
  const scoreAway = match.scoreAway
  const winner = (scoreHome > scoreAway) ? 1 : ((scoreHome < scoreAway) ? 2 : -1)
  const goalDifference = scoreHome - scoreAway

  const _userbets = _.filter(match.bets, function(bet) {
    return bet.user.toString() === user._id.toString()
  })
  const userBet = (_userbets.length > 0) ? _userbets[_userbets.length - 1] : null

  if (userBet) {

    console.warn("User has bet on the match")

    const userScoreHome = userBet.homeScore
    const userScoreAway = userBet.awayScore
    const userWinner = (userScoreHome > userScoreAway) ? 1 : ((userScoreHome < userScoreAway) ? 2 : -1)
    const userGoalDifference = userScoreHome - userScoreAway

    if (userScoreHome === scoreHome && userScoreAway === scoreAway) {
      points += GOOD_SCORE
    } else {

      if (userWinner === winner) {
        points += GOOD_WINNER
      }

      if (goalDifference === userGoalDifference) {
        points += ACCEPTED_GOAL_DIFFERENCE
      }
    }

  } else {
    console.warn("User has not bet on the match")
  }

  if (match.type === "SF") {
    return points * 2
  }

  if (match.type === "FINALE") {
    return points * 3
  }

  return points
}

const updateUserScores = function() {
  let _users = []
  let canUpdateUsers = true

  User.find({}).exec().then(function(users, err) {
    if (err) {
      console.warn("Error when trying to fetch users: " + err)
    } else {

			// keep users in array to updates
      _users = users

			// fetch matchs
      return Match.find({
        startsAt: {
          "$lt": new Date(),
        },
        scoresUpdated: {
          $exists: false,
        },
      })
				.sort("-created")
				.exec()

    }
  }).then(function(matchs, err) {
    if (err) {
      console.warn("Error when trying to fetch matchs: " + err)
    } else {
      _.each(matchs, function(match) {

        if (match.scoreHome !== undefined && match.scoreAway !== undefined) {

          console.warn("Match to update")
          _.each(_users, function(user) {
            if (!user.euroPoints) {
              user.euroPoints = 0
            }

            const userPointOfMatch = getPointsFromMatch(match, user)
            user.euroPoints += userPointOfMatch
          })

          match.scoresUpdated = true
          match.save(function() {
            if (err) {
              console.warn("Error when trying to update match... " + match.home + " - " + match.away)
              canUpdateUsers = false
            } else {
              console.warn("Match updated succefully")
            }
          })

        } else {
          console.warn("Match: " + match.home + " - " + match.away + " has no scores yet!")
        }
      })

      if (canUpdateUsers) {
        _.each(_users, function(user) {
          user.save(function(err) {
            if (err) {
              console.warn("Error when trying to update user scores : " + err)
            } else {
              console.warn("User " + user.username + " has been updated successfully")
            }
          })
        })
      }
    }
  })
}

exports.updateMatch = function(req, res) {
  let match = req.match
  match = _.extend(match, req.body)
  match.save(function(err) {
    console.warn(err)
    if (err) {
      console.log("Error when trying to save match: " + err)
    }

    if (match.scoreHome !== undefined && match.scoreAway !== undefined) {
      updateUserScores()
    }

    res.send(match)
  })
}
