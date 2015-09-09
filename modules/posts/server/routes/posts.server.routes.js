'use strict';

module.exports = function(app) {
	var posts = require('../controllers/posts.server.controller');
	var postsPolicy = require('../policies/posts.server.policy');

	// Posts Routes
	app.route('/api/posts').all()
	  .get(posts.list).all(postsPolicy.isAllowed)
	  .post(posts.uploadImage);

	app.route('/api/posts/:postId').all(postsPolicy.isAllowed)
	  .get(posts.read)
	  .put(posts.update)
	  .delete(posts._delete);

	// Finish by binding the Post middleware
	app.param('postId', posts.postByID);
};
