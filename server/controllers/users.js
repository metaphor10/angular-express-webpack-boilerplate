"use strict"

const moment = require("moment")
const passport = require("passport")
const mongoose = require("mongoose")
const  _ = require("lodash")

const  User = mongoose.model("User")

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
  res.redirect("/")
}

/**
 * Show login form
 */
exports.signin = function(req, res) {
  res.render("users/signin", {
    title: "Signin",
    message: req.flash("error"),
  })
}

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
  res.render("users/signup", {
    title: "Sign up",
    user: new User(),
  })
}

/**
 * Logout
 */
exports.signout = function(req, res) {
  req.logout()
  res.redirect("/")
}

/**
 * Session
 */
exports.session = function(req, res) {
	// Update the last connection date of user when creating session
  User.update({
    _id: req.user._id,
  }, {
    $set: {
      lastConnectionDate: new Date(),
      previousConnectionDate: req.user.lastConnectionDate,
    },
  }, {
    upsert: false,
  }, function() {
    res.redirect("/")
  })
}

/**
 * Before call session
 */
exports.isFutureSessionValid = function(req, res) {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return res.jsonp({
        authenticate: false,
        error: err,
        info: info,
      })
    }
    if (!user) {
      return res.jsonp({
        authenticate: false,
        error: 101,
        info: info,
      })
    }
    return res.jsonp({
      authenticate: true,
      error: null,
    })
  })(req, res)
}

/**
 * Create user
 */
exports.create = function(req, res, next) {
  const user = new User(req.body)
  let message = null

  user.provider = "local"
  user.save(function(err) {
    if (err) {
      switch (err.code) {
      case 11000:
      case 11001:
        message = "Pseudo déjà utilisé"
        break
      default:
        message = "Veuillez renseigner l'ensemble des champs"
      }

      return res.render("users/signup", {
        message: message,
        user: user,
      })
    }
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect("/")
    })
  })
}

exports.update = function(req, res) {
  const user = _.extend(req.user, req.body)
  user.save(function(err) {
    if (err) {
      return res.send("users/signup", {
        errors: err.errors,
        user: user,
      })
    } else {
      res.jsonp(user)
    }
  })
}

/**
 * Send User
 */
exports.me = function(req, res) {
  res.jsonp(req.user || null)
}

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
  User.findOne({
    _id: id,
  }).exec(function(err, user) {
    if (err) return next(err)
    if (!user) return next(new Error("Failed to load User " + id))
    req.profile = user
    next()
  })
}

exports.findOne = function(req, res) {
  res.jsonp(req.profile)
}

/**
 * Return all users
 */
exports.team = function(req, res) {
  User.find({}, "-password -salt -hashed_password -__v -provider").sort("-euroPoints")
		.exec(function(err, users) {
  if (err) {
    res.render("error", {
      status: 500,
    })
  } else {
    res.jsonp(users)
  }
})
}

/**
 * Increment coins of all users (call by cron)
 ***/
exports.incrementUsersPoints = function() {
  User.update({}, {
    $inc: {
      coins: 10,
    },
  }, function(err, affectedRows) {
    if (err) {
      console.warn("err: " + err)
    } else {
      console.warn("Count of updated users " + affectedRows)
    }
  })
}


/**
 * Calculate popularity of users (call by cron)
 ***/
exports.calculatePopularity = function() {
  User.find()
		.exec(function(err, users) {
  if (err) {
    console.warn("err: " + err)
  } else {

    _.each(users, function(user) {
      const newVal = "30"
      user.popularity = newVal
    })
  }
})
}


/**
 * Calculate popularity of users (call by cron)
 ***/
exports.getBirthdays = function() {
  User.find().exec(function(err, users) {
    if (err) {
      console.warn("err: " + err)
    } else {
      const today = moment()
      _.each(users, function(user) {
        if (user.birthday && today.diff(user.birthday, "days") === 0) {
          users.push(user)
        }
      })
      return users
    }
  })
}
