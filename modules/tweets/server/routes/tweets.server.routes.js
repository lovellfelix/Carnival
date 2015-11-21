'use strict';

module.exports = function(app) {
  //var users = require('../../app/controllers/users');
  var tweets = require('../controllers/tweets.server.controller');
  var tweetsPolicy = require('../policies/tweets.server.policy');

  // Tweets Routes
  // app.route('api/tweets').all()
  // 	.get(tweets.list).all(tweetsPolicy.isAllowed)
  // 	.post(tweets.create);

  app.route('/api/tweets').all()
    .get(tweets.list)
    .post(tweets.create);

  app.route('api/tweets/:tweetId')
    .get(tweets.read)
    .put(tweets.update)
    .delete(tweets.delete);

  app.route('api/sendTweetFor')
    .put(tweets.sendTweetFor)
    .post(tweets.sendTweetFor);

  app.route('api/getTop')
    .get(tweets.getTop);

  app.route('/api/importTweets').all()
    .post(tweets.importOld);

  app.route('api/getInformations')
    .get(tweets.getInformations);

  app.route('api/getInformations/:userName')
    .get(tweets.getInformations);

  // Finish by binding the Tweet middleware
  app.param('tweetId', tweets.tweetByID);
};
