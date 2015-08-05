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
    user: {
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


mongoose.model('Tweet', TweetSchema);
