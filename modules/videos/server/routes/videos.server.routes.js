'use strict';

module.exports = function(app) {
	var videos = require('../controllers/videos.server.controller');
	var videosPolicy = require('../policies/videos.server.policy');

	// Videos Routes
	app.route('/api/videos').all()
		.get(videos.list).all(videosPolicy.isAllowed)
		.post(videos.create);

	app.route('/api/videos/:videoId').all(videosPolicy.isAllowed)
		.get(videos.read)
		.put(videos.update)
		.delete(videos.delete);

	// Finish by binding the Video middleware
	app.param('videoId', videos.videoByID);
};