'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Video Schema
 */
var VideoSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Bitte den Namen des Videos eingeben.',
        trim: true
    },
    description: {
        type: String,
        default: '',
        required: 'Bitte eine Beschreibung eingeben.',
        trim: true
    },
    source: {
        type: String,
        default: '',
        required: 'Bitte einen Videolink eingeben.',
        trim: true
    },
    sourceImg: {
        type: String,
        default: '',
        required: 'Bitte ein Vorschaubild eingeben.',
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

mongoose.model('Video', VideoSchema);
