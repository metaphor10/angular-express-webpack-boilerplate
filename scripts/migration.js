/**
 * Module dependencies.
 */
var express = require('express'),
	fs = require('fs'),
	path = require("path"),
	passport = require('passport'),
	logger = require('mean-logger'),
	qt = require('quickthumb'),
	gm = require('gm').subClass({
		imageMagick: true
	});

// Load configurations
// Set the node enviornment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Initializing system variables
var config = require('../config/config'),
	mongoose = require('mongoose');
_ = require('lodash');

// Bootstrap db connection
var db = mongoose.connect(config.db);

// Bootstrap models
var models_path = '../server/models';
var walk = function(path) {
	fs.readdirSync(path).forEach(function(file) {
		var newPath = path + '/' + file;
		var stat = fs.statSync(newPath);
		if (stat.isFile()) {
			if (/(.*)\.(js$|coffee$)/.test(file)) {
				require(newPath);
			}
		} else if (stat.isDirectory()) {
			walk(newPath);
		}
	});
};
walk(models_path);

// Bootstrap passport config
require('../config/passport')(passport);

var app = express();

// Express settings
require('../config/express')(app, passport, db);

var Article = mongoose.model('Article'),
	Suggestion = mongoose.model('Suggestion'),
	Album = mongoose.model('Album'),
	Conversation = mongoose.model('Conversation'),
	UserEvent = mongoose.model('UserEvent'),
	Parameter = mongoose.model('Parameter'),
	User = mongoose.model('User'),
	Match = mongoose.model('Match'),
	Comment = mongoose.model('Comment'),
	EuroData = require('../ressources/euro.json'),
	EuroDataR16 = require('../ressources/euro_qf.json'),
	EuroDataQF = require('../ressources/euro_qf_2.json'),
	EuroDatasSF = require('../ressources/euro_SF.json'),
	EuroDatasFi = require('../ressources/euro_Fi.json');

/*
Script de migration pour remplacer l'url des videos youtube de embed => v
*/
var migrateArticles = function() {
	Article.find().exec(function(err, articles) {
		_.each(articles, function(article) {
			if (article.videoLink) {
				article.videoLink.replace('embed', 'v');
				article.save(function(err) {
					if (err) {
						console.warn(err);
					} else {
						console.warn("Mise à jour de l'article " + JSON.stringify(article));
					}
				});
			}
		});
	});
};

var addParameters = function() {
	var parameter = new Parameter({
		articleCategories: [{
			id: "1",
			value: "Info",
			active: true
		}, {
			id: "2",
			value: "Connerie",
			active: true
		}, {
			id: "3",
			value: "Sport",
			active: true
		}, {
			id: "4",
			value: "Art",
			active: true
		}, {
			id: "5",
			value: "Trompette",
			active: true
		}, {
			id: "6",
			value: "Poney",
			active: true
		}]
	});
	parameter.save(function(err) {
		if (err) {
			console.warn("Error when adding params: " + err);
		} else {
			console.warn("Successfuly add params");
		}
	});
};

var addMatchs = function() {
	var matchs = EuroDatasFi.matchs;
	var teams = EuroData.teams;
	var currentMatch;
	var userEvent;
	_.each(matchs, function(match) {
		currentMatch = new Match(match);
		currentMatch.save(function(err, _matchObject) {
			if (err) {
				console.warn("Error when adding match: " + err);
			} else {
				console.warn("Successfuly add match");
				var homeName = getNameOfCountryCode(teams, match.home);
				var awayName = getNameOfCountryCode(teams, match.away);
				var userEvent = new UserEvent({
					title: homeName + " - " + awayName,
					type: 'inverse',
					eventType: "other",
					content: "Match de l'euro 2016 du groupe " + match.type,
					startsAt: match.startsAt,
					endsAt: match.startsAt,
					editable: false,
					deletable: false,
					incrementsBadgeTotal: true,
					guest: [],
					subType: "euroMatch",
					matchId: _matchObject._id

				});
				userEvent.save(function(err) {
					if (err) {
						console.warn("Error when adding userEvent: " + err);
					} else {
						console.warn("Successfuly add userEvent");
					}
				});
			}
		});
	});
};

var getNameOfCountryCode = function(teams, code) {
	var name = "";
	_.each(teams, function(team) {
		if (team.code == code) {
			name = team.name;
		}
	});

	return name;
};

var rotateImage = function() {
	var oldPath = path.resolve(config.root + "/server/public/img/users/")
	fs.readdir(oldPath, function(err, items) {
		if (items) {
			_.each(items, function(item) {
				var name = item;
				var newPath = path.resolve(config.root + "/server/public/img/tmp/" + name);
				gm(path.resolve(config.root + "/server/public/img/users/" + name))
					.autoOrient()
					.write(newPath, function(err) {

						if (err) {
							console.log("Error when trying to move new image " + err);
						} else {
							console.log("Rotate image ");
						}
					});
			});

			console.warn("End process of image traitment!");
		}
	});
};

var reInitEuroPoints = function() {
	User.find({}).exec(function(err, users) {
		if (err) {
			res.render("error", {
				status: 500
			});
		} else {
			_.each(users, function(user) {
				user.euroPoints = 0;
				user.save(function(err) {
					if (err) {
						console.warn("error when trying to save user");
					} else {
						console.warn("user saved");
					}
				});
			});
		}
	});

	Match.find({}).exec(function(err, matchs) {
		if (err) {
			res.render("error", {
				status: 500
			});
		} else {
			_.each(matchs, function(match) {
				match.scoresUpdated = undefined;
				match.save(function(err) {
					if (err) {
						console.warn("error when trying to save match");
					} else {
						console.warn("match saved");
					}
				});
			});
		}
	});
};

var addReadContents = function() {
	var articleIds = [];
	var albumIds = [];
	var suggestionIds = [];

	Article.find().exec(function(err, articles) {
		articleIds = _.pluck(articles, "_id");
		Album.find().exec(function(err, albums) {
			albumIds = _.pluck(albums, "_id");
			Suggestion.find().exec(function(err, suggestions) {
				suggestionIds = _.pluck(suggestions, "_id");
				User.find({}).exec(function(err, users) {
					if (err) {
						console.warn("Error")
					} else {
						_.each(users, function(user) {
							user.readArticles = articleIds;
							user.readAlbums = albumIds;
							user.readVotes = suggestionIds;
							user.save(function(err) {
								if (err) {
									console.warn("error when trying to save user");
								} else {
									console.warn("user updated");
								}
							});
						});
					}
				});
			});
		});
	});
};

var changeQuoteToVote = function(){
	Article.find({
		type: "quote"
	}).exec(function(err, articles) {
		_.each(articles, function(article){
			article.type = "vote"
			article.save(function(err){
				if (err) {
					console.warn("error when trying to save user");
				} else {
					console.warn("article updated");
				}
			})
		});
	});
};

var migrateAlbums = function() {

	Album.find().exec(function(err, album) {

			if (err) {
				console.warn("Error when to fetch album " + err);
			} else {
				_.each(album, function(album) {

					var article = new Article({
						title: album.name,
						user: album.user,
						content: album.description,
						type: "album",
						comments: [],
						created: album.created,
						photoList: album.photoList,
						coverPicPath: album.coverPicPath
					});

					article.save(function(err) {

						if (err) {
							console.warn("Error when trying to save new article " + err);
						} else {
							console.warn("Save new article ");
						}
					});
				});
			}
		});
};


// addParameters();
//addMatchs();
// rotateImage();

// reInitEuroPoints();
// addReadContents();
// updateUserScores();

changeQuoteToVote();
migrateAlbums();
