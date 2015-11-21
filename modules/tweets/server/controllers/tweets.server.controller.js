'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Tweet = mongoose.model('Post'),
  User = mongoose.model('User'),
  _ = require('lodash'),
  path = require('path'),
  twitter = require('twitter'),
  config = require('./../../../../config/config'),
  util = require('util'),
  Q = require('q'),
  moment = require('moment'),
  cronJob = require('cron').CronJob,
  http = require('http'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
  var message = '';
  console.log(err);
  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Tweet already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  return message;
};


/**
 * makeMongooseReq for methode getTop && list && cron Job
 */
function makeMongooseReq(req, groupeBy) {

  var toReturn = Q.defer();

  var dateStart = moment('16-06-2014', 'DD-MM-YYYY').toDate();
  var dateEnd = moment().toDate();

  //Param dateStart
  if (req.query.dateStart !== undefined) {
    dateStart = moment(req.query.dateStart, 'DD-MM-YYYY').toDate();
  }

  //Param dateEnd
  if (req.query.dateEnd !== undefined) {
    dateEnd = moment(req.query.dateEnd, 'DD-MM-YYYY').toDate();
  }

  if (dateEnd < dateStart) {
    dateEnd = dateStart;
  }

  var reqMongo;
  var agg = [{
    $match: {
      'created_at': {
        '$gte': dateStart,
        '$lt': dateEnd
      }
    }
  }];

  //Param start
  if (req.query.to !== undefined && req.query.to) {

    console.log('req.query.to', typeof req.query.to);
    if (typeof req.query.to === 'string') {
      req.query.to = [req.query.to];
    }

    agg.push({
      $match: {
        to: {
          $in: req.query.to
        }
      }
    });
  }


  if (groupeBy !== undefined) {
    agg.push({
      $match: {
        'to': {
          '$ne': null
        }
      }
    });
    agg.push({
      $group: {
        _id: '$' + groupeBy,
        from_user_profile_image_url: {
          $push: '$user.profile_image_url'
        },
        from: {
          $push: '$from'
        },
        to: {
          $push: '$to'
        },
        total: {
          $sum: 1
        }
      }
    });
    agg.push({
      $sort: {
        total: -1
      }
    });
  } else {
    agg.push({
      $sort: {
        created_at: -1
      }
    });
  }

  //Param start
  if (req.query.start !== undefined) {
    agg.push({
      $skip: parseInt(req.query.start.toString())
    });
  }
  //Param limit
  if (req.query.limit !== undefined) {
    agg.push({
      $limit: parseInt(req.query.limit.toString())
    });
  }

  reqMongo = Tweet.aggregate(agg);

  reqMongo.exec(function(err, tweets) {
    if (err) {
      toReturn.reject(getErrorMessage(err));
    } else {
      toReturn.resolve(tweets);
    }
  });

  return toReturn.promise;
}

var twit = new twitter({
  consumer_key: config.twitter.clientID,
  consumer_secret: config.twitter.clientSecret,
  access_token_key: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

var users = {};

function getUser(username, callback) {
  if (typeof users[username] !== 'undefined') {
    callback(users[username]);
  } else {
    User.findOne({
      "username": username
    }, function(err, user) {
      users[username] = user;
      callback(user);
    });
  }
}

function createTweetFromTwitterData(data) {
  if (process.env.NODE_ENV === 'development') {
    console.log(data);
  }

  var robot;

  getUser('robot', function(user) {
    robot = user._id;
  });

  console.log(robot);

  var tweet = new Tweet({
    created_at: new Date(Date.parse(data.created_at)),
    id: data.id,
    text: data.text,
    tuser: {
      id: data.user.id,
      name: data.user.name,
      screen_name: data.user.screen_name,
      profile_image_url: data.user.profile_image_url_https
    },
    favorite_count: data.favorite_count,
    extended_entities: {
      media: data.extended_entities.media
    },
    entities: {
      hashtags: [],
      user_mentions: [],
      urls: []
    },
    postedBy: robot
  });

  tweet.dateTime = moment(tweet.created_at).format('DD-MM-YYYY HH:mm:ss');

  var regExTo = /^Merci ([a-zA-z]+)/i;
  var foundRegExTo = regExTo.exec(tweet.text);

  if (foundRegExTo !== null) {
    tweet.to = foundRegExTo[1].toLowerCase();
  }


  var regExFrom = /from ([a-zA-z]+)$/i;
  var foundRegExFrom = regExFrom.exec(tweet.text);

  if (foundRegExFrom !== null) {
    tweet.from = foundRegExFrom[1].toLowerCase();
  }
  var media = data.extended_entities.media.length;
  //
  // if (data.extended_entities === undefined) {
  // 	tweet.extended_entities.media = [];
  // } else {
  // 	tweet.extended_entities.media;
  // }



  var hashtags = data.entities.hashtags.length;
  if (hashtags > 0) {
    tweet.entities.hashtags = _.pluck(data.entities.hashtags, 'text');
  }

  var user_mentions = data.entities.user_mentions.length;
  if (user_mentions > 0) {
    tweet.entities.user_mentions = _.pluck(data.entities.user_mentions, 'screen_name');
  }

  return tweet;
}


function createTweetFromTwitterDataAndSave(data) {

  var toReturn = Q.defer();
  var tweet = createTweetFromTwitterData(data);
  tweet.save(function(err) {
    if (err) {
      console.log(getErrorMessage(err));
      toReturn.reject(null);
    } else {
      console.log('TweetSave');
      //console.log(tweet);
      toReturn.resolve(tweet);
    }
  });

  return toReturn.promise;

}

/**
 * Create a Tweet
 */
exports.create = function(req, res) {

  console.log('add id : ' + req.body.id);
  twit.get('/statuses/show/' + req.body.id + '.json', {
    include_entities: true
  }, function(data) {
    createTweetFromTwitterDataAndSave(data).then(
      function(tweet) {
        res.jsonp(tweet);
      },
      function() {
        return res.send(400, {
          message: 'Fail'
        });
      });

  });

};

/**
 * Show the current Tweet
 */
exports.read = function(req, res) {
  res.jsonp(req.tweet);
};

/**
 * Update a Tweet
 */
exports.update = function(req, res) {
  var tweet = req.tweet;

  tweet = _.extend(tweet, req.body);

  tweet.save(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(tweet);
    }
  });
};

/**
 * Delete an Tweet
 */
exports.delete = function(req, res) {
  var tweet = req.tweet;

  tweet.remove(function(err) {
    if (err) {
      return res.send(400, {
        message: getErrorMessage(err)
      });
    } else {
      res.jsonp(tweet);
    }
  });
};

/**
 * List of Pictures
 */
exports.list = function(req, res) {
  Tweet.find().sort('-created').exec(function(err, tweets) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tweets);
    }
  });
};


/**
 * List of TopTweet
 */
exports.getTop = function(req, res) {

  var param = req.param('of') || 'to';


  makeMongooseReq(req, param)
    .then(
      function(tweets) {
        res.jsonp(tweets);
      },
      function(errMsg) {
        return res.send(400, {
          message: errMsg
        });
      });
};



/**
 * Tweet middleware
 */
exports.tweetByID = function(req, res, next, id) {
  Tweet.findById(id).populate('displayName').exec(function(err, tweet) {
    if (err) return next(err);
    if (!tweet) return next(new Error('Failed to load Tweet ' + id));
    req.tweet = tweet;
    next();
  });
};

/**
 * Tweet authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.tweet.user.admin) {
    return res.send(403, 'User is not authorized');
  }
  next();
};
/**
 * Send a tweet methode for tweet && sendTweetFor
 */
function sendTweet(msg) {

  var toReturn = Q.defer();
  if (msg !== undefined) {
    console.log('Tweet : ' + msg);
    twit.updateStatus(msg,
      function(data) {
        console.log(util.inspect(data));
        if (data.statusCode === undefined) {
          createTweetFromTwitterDataAndSave(data).then(
            function(tweet) {
              toReturn.resolve(tweet);
            },
            function() {
              toReturn.reject('Fail save');
            });
        } else {
          toReturn.reject(JSON.parse(data.data).errors[0].message);
        }
      }
    );
  } else {
    toReturn.reject('Missing param(s)');
  }

  return toReturn.promise;
}


/**
 * Send a tweet
 */
exports.tweet = function(req, res) {

  if (req.query.msg !== undefined) {

    sendTweet(req.query.msg)
      .then(
        function(tweet) {
          res.jsonp(tweet);
        },
        function(errMsg) {
          return res.send(400, {
            message: errMsg
          });
        });
  } else {
    return res.send(400, {
      message: 'Missing param'
    });
  }
};
/**
 * Send a tweet to thank someone
 */
exports.sendTweetFor = function(req, res) {

  var from = req.user.username || req.param('from');
  console.log(req.query, req.param('msg'), req.param('to'), from);

  if (req.param('msg') !== undefined && req.param('to') !== undefined && from !== undefined && from !== null) {

    if (!(req.param('to').match(/^[a-zA-Z]+$/) !== null && req.param('msg').match('/^((?!' + config.htag + ').)*$/') === null)) {

      return res.send(400, {
        message: 'Tweets incorrect !'
      });
    }

    var msg = 'Merci ' + req.param('to') + ' ' + req.param('msg') + ' ' + config.htag + ' de ' + from;


    sendTweet(msg)
      .then(
        function(tweet) {
          res.jsonp(tweet);
        },
        function(errMsg) {
          return res.send(400, {
            message: errMsg
          });
        });

  } else {
    return res.send(400, {
      message: 'Missing param(s)'
    });
  }
};

exports.getInformations = function(req, res) {

  var userName = req.param('of') || req.user.username;
  var toReturn = {
    of: userName,
    position: null,
    votes: 0,
    positionOn: null
  };
  console.log(toReturn);

  makeMongooseReq(req, 'to')
    .then(
      function(tweets) {

        var user = _.find(tweets, {
          '_id': userName
        });
        toReturn.positionOn = tweets.length + 1;

        if (user !== undefined) {
          toReturn.position = tweets.indexOf(user) + 1;
          toReturn.votes = user.total;
        }
        res.jsonp(toReturn);
      },
      function(errMsg) {
        return res.send(400, {
          message: errMsg
        });
      });


};

/*
    BackgroundJob Tweeter
 */

var runStreamLookup = function() {
  twit.stream('statuses/filter', {
    track: config.htag
  }, function(stream) {

    if (process.env.NODE_ENV === 'development') {
      console.log('start stream on : ' + config.htag);
    }

    stream.on('data', function(data) {
      console.log('@' + data.user.screen_name + ' : ' + data.user.name);
      if (data.extended_entities.media !== undefined && !(data.retweeted_status !== undefined && data.retweeted_status.retweet_count !== undefined)) {
        createTweetFromTwitterDataAndSave(data);
      } else {

        if (process.env.NODE_ENV === 'development') {
          console.log('Is a rt => not save');
        }
      }
    });
    stream.on('end', function(data) {
      //console.log('end',data);
      console.log('end');
      stream.destroy();
      runStreamLookup();
    });
    stream.on('error', function(error) {
      //console.log('error', error);
    });
  });
};
if (config.lookupTwitterStream) {
  runStreamLookup();
} else {

  if (process.env.NODE_ENV === 'development') {
    console.log('stream off : ' + config.htag);
  }

}


/*
 BackgroundJob Stats
 */

if (config.sendStats) {
  var job = new cronJob({
    cronTime: '00 35 00 * * 2-6',
    onTick: function() {
      var limit = 3;
      var now = moment();
      var yesterday = now.subtract('days', 1);
      var req = {};
      req.query = {};
      //req.query.dateEnd = yesterday.format('DD-MM-YYYY');
      req.query.limit = limit;

      makeMongooseReq(req, 'to')
        .then(
          function(tweets) {
            var msg = 'Classement du  ' + yesterday.format('DD/MM/YYYY') + ' : \n';
            for (var cpt = 0; cpt < limit; cpt++) {
              msg += (cpt + 1) + ' : ' + tweets[cpt]._id + ' : ' + tweets[cpt].total + ' point';
              if (tweets[cpt].total > 1) {
                msg += 's';
              }
              if ((cpt + 1) !== limit) {
                msg += ',\n';
              }
            }
            msg += ' ' + config.htag;
            sendTweet(msg);
          },
          function(errMsg) {
            console.log(errMsg);
          });


    },
    start: true,
    timeZone: 'Europe/Paris'
  });
} else {
  console.log('stat job off : ' + config.htag);
}


//req.query.name

var ii = 1;
/*

 */
function importLoop(count, until) {
  console.log('importLoop');
  // twit.search(config.htag, { count : count, since_id : since_id } ,function(data) {
  //
  twit.get('search/tweets', {
    q: config.oldTags,
    count: count,
    until: until
  }, function(error, data, response) {

    // var i;
    //var limit = count < data.statuses.length  ? count : (data.statuses.length - 1);
    // var min_id = null;
    // for(i = 0; i < data.statuses.length; i++) {
    //     console.log('ii ' + data.statuses[i].id + '  : ' + ii++);
    var i;
    var limit = count < data.statuses.length ? count : (data.statuses.length - 1);
    var min_id = null;
    for (i = 0; i < limit; i++) {
      console.log('ii ' + data.statuses[i].id + '  : ' + ii++);
      min_id = min_id !== null && min_id < data.statuses[i].id ? min_id : data.statuses[i].id;

      createTweetFromTwitterDataAndSave(data.statuses[i]);
    }

    var lastTweet = data.statuses[(data.statuses.length - 1)];
    //console.log(util.inspect(lastTweet.id));
    console.log(util.inspect(data.search_metadata));

    if (data.statuses.extended_entities === undefined || data.search_metadata.next_results !== undefined && data.statuses.length > 0 && ii < 100) {
      console.log('new loop after ');
      console.log(util.inspect(data.search_metadata));
      importLoop(count, min_id);
    }

  });
}

exports.importOld = function(req, res) {

  var importVagues = 500;
  var until = '2015-08-07';
  console.log('importOld');
  importLoop(importVagues, until);

  res.jsonp({
    message: 'ok'
  });


};
