'use strict';

//Tweets service used to communicate Tweets REST endpoints
angular.module('tweets').factory('Tweets', ['$resource',
  function($resource) {
    return $resource('api/tweets/:tweetId', {
      tweetId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

angular.module('tweets').factory('SendTweetFor', ['$resource',
  function($resource) {
    return $resource('api/sendTweetFor', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
]);


angular.module('tweets').factory('Top', ['$resource',
  function($resource) {
    return $resource('api/getTop');
  }
]);

angular.module('tweets').factory('TweetInformations', ['$resource', 'Authentication',
  function($resource, Authentication) {
    return $resource('getInformations/:userName', {
      userName: Authentication.username
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
