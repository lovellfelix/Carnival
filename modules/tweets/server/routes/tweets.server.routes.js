'use strict';

module.exports = function(app) {
	var tweets = require('../controllers/tweets.server.controller');
	var tweetsPolicy = require('../policies/tweets.server.policy');

	// Tweets Routes
	app.route('/api/tweets').all()
		.get(tweets.list).all(tweetsPolicy.isAllowed)
		.post(tweets.create);

	app.route('/api/tweets/:tweetId').all(tweetsPolicy.isAllowed)
		.get(tweets.read)
		.put(tweets.update)
		.delete(tweets.delete);

	// Finish by binding the Tweet middleware
	app.param('tweetId', tweets.tweetByID);
};