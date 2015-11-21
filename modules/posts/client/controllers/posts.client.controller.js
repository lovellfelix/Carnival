'use strict';

// Posts controller
angular.module('posts').controller('PostsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Posts', '$modal', 'FileUploader', 'Lightbox',
  function($scope, $state, $stateParams, $location, Authentication, Posts, $modal, FileUploader, Lightbox) {
    $scope.authentication = Authentication;
    $scope.loading = false;
    $scope.filteredPosts = [];

    // Open Image in LightBox
    $scope.openViewer = function(photo, title) {
      var photos = [{
        'url': photo,
        'caption': title
      }];
      Lightbox.openModal(photos, 0);
    };

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/posts'
    });

    // Set the limit to one file
    $scope.uploader.queueLimit = 1;

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function(item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|'.indexOf(type) !== -1;
      }
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'sizeFilter',
      fn: function(item, options) {
        return item.size <= 7048000;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function(fileItem) {
      $scope.addingFileError = null;

    };

    $scope.uploader.onWhenAddingFileFailed = function(item, filter, options) {
      $scope.addingFileError = 'Das Bild muss jpg oder png sein und darf maximal 2 MB gross sein';
    };
    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {

      // Set Loading to false again
      $scope.loading = false;

      console.log(response);
      // Set the picture:
      $scope.picture = response;
      // Redirect to picture view
      $scope.uploader.clearQueue();
      $location.path('/');
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
      // Set Loading to false again
      $scope.loading = false;
      $scope.uploader.clearQueue();
      // Show error message
      $scope.error = response.message;
    };

    // Moment Uploader Modal
    $scope.openUploader = function() {
      $modal.open({
        templateUrl: 'modules/posts/views/create-post.client.view.html',
        scope: $scope
      });
    };


    $scope.startUpload = function() {
      // Clear messages
      $scope.error = null;

      if ($scope.uploader.queue.length < 1) {
        $scope.error = 'Bitte ein Bild ' + decodeURI('ausw%C3%A4hlen');
      } else {
        // Add the picture data to the http POST body:
        $scope.uploader.queue[0].formData.push({
          name: $scope.name
        });
        // set loadin and start upload
        $scope.loading = true;
        $scope.uploader.uploadAll();
        // reload view
        $state.reload();

      }

    };


    $scope.loadPosts = function() {
      if ($scope.posts) {
        if ($scope.filteredPosts.length < $scope.posts.length) {
          var last = $scope.filteredPosts.length - 1;

          var postLimit = 6;
          if ($scope.posts.length - $scope.filteredPosts.length < postLimit)
            postLimit = $scope.posts.length - $scope.filteredPosts.length;

          for (var i = 1; i <= postLimit; i++) {
            $scope.filteredPosts.push($scope.posts[last + i]);
          }
        } else {
          $scope.filteredPosts = $scope.posts;
        }
      }
    };



    // // Create new Post
    // $scope.create = function() {
    // 	// Create new Post object
    // 	var post = new Posts ({
    // 		name: this.name,
    // 	});
    //
    // 	post.$save(function(response) {
    // 		// $location.path('posts/' + response._id);
    //
    // 		 $location.path('/');
    // 		 				// Clear form fields
    // 	 				$scope.name = '';
    // 			// close the modal
    // 			//modal.$close();
    // 			// reload view
    // 			$state.reload();
    //
    // 	}, function(errorResponse) {
    // 		$scope.error = errorResponse.data.message;
    // 	});
    // };

    // Remove existing Post
    $scope.remove = function(post) {
      if (post) {
        post.$remove();
        for (var i in $scope.posts) {
          if ($scope.posts[i] === post) {
            $scope.posts.splice(i, 1);
          }
        }
        //$state.reload();
      } else {
        $scope.post.$remove(function() {
          $location.path('posts');
        });
      }
    };

    // Update existing Post
    $scope.update = function() {
      var post = $scope.post;

      post.$update(function() {
        $location.path('posts/' + post._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Posts
    // $scope.find = function() {
    // 	$scope.posts = Posts.query();
    // };

    // Find a list of Moments
    $scope.find = function() {
      Posts.query(function(data) {
        $scope.posts = data;
        $scope.loadPosts();
      });
    };


    // Find existing Post
    $scope.findOne = function() {
      $scope.post = Posts.get({
        postId: $stateParams.postId
      });
    };

  }
]);
