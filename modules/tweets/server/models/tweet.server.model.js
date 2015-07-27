'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tweet Schema
 */
var TweetSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Tweet name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Tweet', TweetSchema);