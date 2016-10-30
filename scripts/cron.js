'use strict';

var CronJob = require('cron').CronJob;
var users = require('../server/controllers/users');
var suggestions = require('../server/controllers/suggestions');
var matchs = require('../server/controllers/match');

exports.startCron = function() {

	// Runs every day at 00h30
	var job = new CronJob('00 30 00 * * *', function() {
			//users.incrementUsersPoints();
			//users.calculatePopularity();
			suggestions.closeVotes();
		}, function() {
			// This function is executed when the job stops
			console.warn("Cron job executed");
		},
		false /* Start the job right now */
		// timeZone /* Time zone of this job. */
	);

	job.start();
};
