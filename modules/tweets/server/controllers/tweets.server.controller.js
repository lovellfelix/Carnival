'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Tweet = mongoose.model('Tweet'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Tweet
 */
exports.create = function(req, res) {
	var tweet = new Tweet(req.body);
	tweet.user = req.user;

	tweet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tweet);
		}
	});
};

/**
 * Show the current Tweet
 */
exports.read = function(req, res) {
	res.jsonp(req.tweet);
};

/**
 * Update a Tweet
 */
exports.update = function(req, res) {
	var tweet = req.tweet ;

	tweet = _.extend(tweet , req.body);

	tweet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tweet);
		}
	});
};

/**
 * Delete an Tweet
 */
exports.delete = function(req, res) {
	var tweet = req.tweet ;

	tweet.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tweet);
		}
	});
};

/**
 * List of Tweets
 */
exports.list = function(req, res) { Tweet.find().sort('-created').populate('user', 'displayName').exec(function(err, tweets) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tweets);
		}
	});
};

/**
 * Tweet middleware
 */
exports.tweetByID = function(req, res, next, id) { Tweet.findById(id).populate('user', 'displayName').exec(function(err, tweet) {
		if (err) return next(err);
		if (! tweet) return next(new Error('Failed to load Tweet ' + id));
		req.tweet = tweet ;
		next();
	});
};