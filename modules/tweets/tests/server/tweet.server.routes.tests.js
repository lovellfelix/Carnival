'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tweet = mongoose.model('Tweet'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, tweet;

/**
 * Tweet routes tests
 */
describe('Tweet CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Tweet
		user.save(function() {
			tweet = {
				name: 'Tweet Name'
			};

			done();
		});
	});

	it('should be able to save Tweet instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tweet
				agent.post('/api/tweets')
					.send(tweet)
					.expect(200)
					.end(function(tweetSaveErr, tweetSaveRes) {
						// Handle Tweet save error
						if (tweetSaveErr) done(tweetSaveErr);

						// Get a list of Tweets
						agent.get('/api/tweets')
							.end(function(tweetsGetErr, tweetsGetRes) {
								// Handle Tweet save error
								if (tweetsGetErr) done(tweetsGetErr);

								// Get Tweets list
								var tweets = tweetsGetRes.body;

								// Set assertions
								(tweets[0].user._id).should.equal(userId);
								(tweets[0].name).should.match('Tweet Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tweet instance if not logged in', function(done) {
		agent.post('/api/tweets')
			.send(tweet)
			.expect(403)
			.end(function(tweetSaveErr, tweetSaveRes) {
				// Call the assertion callback
				done(tweetSaveErr);
			});
	});

	it('should not be able to save Tweet instance if no name is provided', function(done) {
		// Invalidate name field
		tweet.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tweet
				agent.post('/api/tweets')
					.send(tweet)
					.expect(400)
					.end(function(tweetSaveErr, tweetSaveRes) {
						// Set message assertion
						(tweetSaveRes.body.message).should.match('Please fill Tweet name');
						
						// Handle Tweet save error
						done(tweetSaveErr);
					});
			});
	});

	it('should be able to update Tweet instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tweet
				agent.post('/api/tweets')
					.send(tweet)
					.expect(200)
					.end(function(tweetSaveErr, tweetSaveRes) {
						// Handle Tweet save error
						if (tweetSaveErr) done(tweetSaveErr);

						// Update Tweet name
						tweet.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tweet
						agent.put('/api/tweets/' + tweetSaveRes.body._id)
							.send(tweet)
							.expect(200)
							.end(function(tweetUpdateErr, tweetUpdateRes) {
								// Handle Tweet update error
								if (tweetUpdateErr) done(tweetUpdateErr);

								// Set assertions
								(tweetUpdateRes.body._id).should.equal(tweetSaveRes.body._id);
								(tweetUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tweets if not signed in', function(done) {
		// Create new Tweet model instance
		var tweetObj = new Tweet(tweet);

		// Save the Tweet
		tweetObj.save(function() {
			// Request Tweets
			request(app).get('/api/tweets')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tweet if not signed in', function(done) {
		// Create new Tweet model instance
		var tweetObj = new Tweet(tweet);

		// Save the Tweet
		tweetObj.save(function() {
			request(app).get('/api/tweets/' + tweetObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tweet.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tweet instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tweet
				agent.post('/api/tweets')
					.send(tweet)
					.expect(200)
					.end(function(tweetSaveErr, tweetSaveRes) {
						// Handle Tweet save error
						if (tweetSaveErr) done(tweetSaveErr);

						// Delete existing Tweet
						agent.delete('/api/tweets/' + tweetSaveRes.body._id)
							.send(tweet)
							.expect(200)
							.end(function(tweetDeleteErr, tweetDeleteRes) {
								// Handle Tweet error error
								if (tweetDeleteErr) done(tweetDeleteErr);

								// Set assertions
								(tweetDeleteRes.body._id).should.equal(tweetSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tweet instance if not signed in', function(done) {
		// Set Tweet user 
		tweet.user = user;

		// Create new Tweet model instance
		var tweetObj = new Tweet(tweet);

		// Save the Tweet
		tweetObj.save(function() {
			// Try deleting Tweet
			request(app).delete('/api/tweets/' + tweetObj._id)
			.expect(403)
			.end(function(tweetDeleteErr, tweetDeleteRes) {
				// Set message assertion
				(tweetDeleteRes.body.message).should.match('User is not authorized');

				// Handle Tweet error error
				done(tweetDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Tweet.remove().exec(function(){
				done();
			});
		});
	});
});
