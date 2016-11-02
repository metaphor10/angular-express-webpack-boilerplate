"use strict"

const CronJob = require("cron").CronJob
const votes = require("../server/controllers/votes")

exports.startCron = function() {

	// Runs every day at 00h30
  const job = new CronJob("00 30 00 * * *", function() {
			// users.incrementUsersPoints();
			// users.calculatePopularity();
    votes.closeVotes()
  }, function() {
			// This function is executed when the job stops
    console.warn("Cron job executed")
  },
	false /* Start the job right now */
	)

  job.start()
}
