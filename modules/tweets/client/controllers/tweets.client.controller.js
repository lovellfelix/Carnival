'use strict';

// Tweets controller
angular.module('tweets').controller('TweetsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Tweets', 'Top', 'SendTweetFor', 'TweetInformations',
  function($scope, $state, $stateParams, $location, Authentication, Tweets, Top, SendTweetFor, TweetInformations) {
    $scope.authentication = Authentication;

    //$scope.htag = htag;

    // Create new Tweet
    $scope.create = function() {
      // Create new Tweet object
      var tweet = new Tweets({
        id: this.id
      });

      // Redirect after save
      tweet.$save(function(response) {
        $location.path('tweets/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });

      // Clear form fields
      this.name = '';
    };

    // Remove existing Tweet
    $scope.remove = function(tweet) {
      if (tweet) {
        tweet.$remove();

        for (var i in $scope.tweets) {
          if ($scope.tweets[i] === tweet) {
            $scope.tweets.splice(i, 1);
          }
        }
      } else {
        $scope.tweet.$remove(function() {
          $location.path('tweets');
        });
      }
    };

    // Update existing Tweet
    $scope.update = function() {
      var tweet = $scope.tweet;

      tweet.$update(function() {
        $location.path('tweets/' + tweet._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Tweets
    $scope.find = function() {
      $scope.tweets = Tweets.query();
    };

    // Find existing Tweet
    $scope.findOne = function() {
      $scope.tweet = Tweets.get({
        tweetId: $stateParams.tweetId
      });
    };



    // Find a top list of Tweets
    $scope.top = function() {


      $scope.data = 30;

      $scope.total = 0;

      $scope.knobOptions = {
        'width': 100,
        'height': 100,
        'fgColor': '#008ed6',
        'displayInput': false,
        'readOnly': true,
        'angleOffset': 0
          /*,
                          'rotation': 'anticlockwise'*/
      };

      $scope.topTo = Top.query();

      $scope.topFrom = Top.query({
        of: 'from'
      });

      // $scope.getTotal = function(){
      //     var total = 0;
      //     for(var i = 0; i < $scope.topTo.length; i++){
      //         total += $scope.topTo[i].total;
      //     }
      //     $scope.maxTweetsTo = _.max($scope.topTo, function(data) { return data.total; }).total;
      //     $scope.maxTweetsFrom = _.max($scope.topFrom, function(data) { return data.total; }).total;
      //     $scope.total = total -1 ;
      //     return total;
      // };

    };

    // Find a top list of Tweets
    $scope.direMerci = function() {

      var sendTweetFor = new SendTweetFor({
        to: $scope.to,
        msg: $scope.msg
      });

      // Redirect after save
      sendTweetFor.$save(function(response) {
        $location.path('infos/' + response.to);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a top list of Tweets
    $scope.me = function() {

      if (Authentication.user === null) {
        $state.go('signin');
        return;
      }
      //user/{{topTo[0]._id}}_small.jpg


      $scope.tweetInformations = TweetInformations.get();
      $scope.topTo = Top.query({
        to: Authentication.user.username
      });

      $scope.tweets = Tweets.query({
        to: Authentication.user.username
      });
    };

    $scope.info = function() {
      $scope.tweetInformations = TweetInformations.get({
        of: $stateParams.user
      });
      $scope.topTo = Top.query({
        to: $stateParams.user
      });

      $scope.tweets = Tweets.query({
        to: $stateParams.user
      });
    };

    $scope.goto = function(url) {
      console.log(url);
    };

  }
]);
