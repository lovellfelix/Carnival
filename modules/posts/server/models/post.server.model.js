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
	// name: {
	// 	type: String,
	// 	default: '',
	// 	required: 'Please fill Post name',
	// 	trim: true
	// },
	// created: {
	// 	type: Date,
	// 	default: Date.now
	// },
	// fileName: {
	// 	type: String,
	// 	default: '',
	// 	required: 'fileName missing',
	// 	trim: true
	// },
	// sizes: [{
	// 	label: {
	// 		type: String,
	// 		default: '',
	// 		trim: true
	// 	},
	// 	source: {
	// 		type: String,
	// 		default: '',
	// 		trim: true
	// 	},
	// 	width: {
	// 		type: Number,
	// 		default: 0
	// 	},
	// 	height: {
	// 		type: Number,
	// 		default: 0
	// 	}
	// }],
	// user: {
	// 	type: Schema.ObjectId,
	// 	ref: 'User'
	// }

	created_at: {
	type: Date,
	default: Date.now
		},
		dateTime: {
				type: String,
				default: '',
				trim: true
		},
		id: {
	unique: true,
	type: Number,
	default : 0
		},
		text: {
				type: String,
				default: '',
				trim: true
		},
		tuser: {
				 id: { type: Number, default : 0 },
				 name: { type: String, default: '', trim: true },
				 screen_name: { type: String, default: '', trim: true },
				 profile_image_url: { type: String, default: '', trim: true }
		},
	extended_entities: {
		media: { type : Array , default : [] }
	},
	entities: {
	hashtags : { type : Array , default : [] },
	urls : { type : Array , default : [] },
	user_mentions :  { type : Array , default : [] }
		},
		to: {
				type: String,
				default: null,
				trim: true
		},
		from: {
				type: String,
				default: '',
				required: 'Please fill Tweet from',
				trim: true
		}

});

mongoose.model('Post', PostSchema);
