'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Post Schema
 */
var PostSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Post name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	fileName: {
		type: String,
		default: '',
		required: 'fileName missing',
		trim: true
	},
	sizes: [{
		label: {
			type: String,
			default: '',
			trim: true
		},
		source: {
			type: String,
			default: '',
			trim: true
		},
		width: {
			type: Number,
			default: 0
		},
		height: {
			type: Number,
			default: 0
		}
	}],
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Post', PostSchema);
