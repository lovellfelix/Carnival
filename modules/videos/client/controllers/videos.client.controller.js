'use strict';

// Videos controller
angular.module('videos').controller('VideosController', ['$sce', '$scope', '$stateParams', '$location', 'Authentication', 'Videos',
    function ($sce, $scope, $stateParams, $location, Authentication, Videos) {
        $scope.authentication = Authentication;
        $scope.videoPreview = false;
        $scope.youTubeCode = '';

        $scope.videoIframe = {
            current: 0,
            set: function (index) {
                this.current = index;
            }
        };


        $scope.cancel = function () {
            $scope.name = '';
            $scope.description = '';
            $scope.sourceImg = '';
            $scope.source = '';
            $scope.videoPreview = false;
            $scope.youTubeCode = '';
        };

        // check source of the video
        $scope.decodeYoutubeLink = function () {
            var youTubeCode = $scope.youTubeCode;
            var youTubeId = '';
            //https://www.youtube.com/watch?v=MayFPcrHj8o
            if (youTubeCode.search('www.youtube.com/watch\\?v') !== -1) {
                youTubeId = youTubeCode.split('www.youtube.com/watch?v=')[1];
            }
            //https://www.youtube.com/watch?feature=player_detailpage&v=MayFPcrHj8o
            else if (youTubeCode.search('www.youtube.com/watch\\?feature=player_detailpage&v=') !== -1) {
                youTubeId = youTubeCode.split('www.youtube.com/watch?feature=player_detailpage&v=')[1];
            }
            //<iframe width="640" height="360" src="https://www.youtube.com/embed/MayFPcrHj8o?feature=player_detailpage" frameborder="0" allowfullscreen></iframe>
            else if (youTubeCode.search('www.youtube.com/embed/') !== -1) {
                youTubeId = youTubeCode.split('www.youtube.com/embed/')[1];
                youTubeId = youTubeId.split('?')[0];
            }
            else {
                $scope.error = 'Falscher Youtube Code.';
            }

            if (youTubeId !== '') {
                $scope.source = 'https://www.youtube.com/embed/' + youTubeId;
                //https://i.ytimg.com/vi/EwI1sT75JGQ/default.jpg
                $scope.sourceImg = 'https://i.ytimg.com/vi/'+ youTubeId +'/default.jpg';
                $scope.videoPreview = true;
                $scope.error = '';
            }
            else {
                $scope.error = 'Falscher Youtube Code.';
            }
        };

        // Create new Video
        $scope.create = function () {
            // Create new Video object
            var video = new Videos({
                name: this.name,
                description: this.description,
                source: this.source,
                sourceImg: this.sourceImg
            });

            // Redirect after save
            video.$save(function (response) {
                $location.path('videos');

                // Clear form fields
                $scope.cancel();

            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Video
        $scope.remove = function (video) {
            if (video) {
                video.$remove();

                for (var i in $scope.videos) {
                    if ($scope.videos [i] === video) {
                        $scope.videos.splice(i, 1);
                    }
                }
            } else {
                $scope.video.$remove(function () {
                    $location.path('videos');
                });
            }
        };

        // Update existing Video
        $scope.update = function () {
            var video = $scope.video;

            video.$update(function () {
                $location.path('videos/' + video._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Videos
        $scope.find = function () {
            // use the callback to make sure slick init-onload=true with data="videos" is working properly
            Videos.query(function (queryResult) {
                $scope.videos = queryResult;
            });
        };

        // Find existing Video
        $scope.findOne = function () {
            $scope.video = Videos.get({
                videoId: $stateParams.videoId
            });
        };
    }
]);
