'use strict';

const async = require('async');
const config = require('config');
const cookieParser = require('cookie-parser');
const AWS = require('aws-sdk');
const _ = require('lodash');
const Twitter = require('twitter');
const getBearerToken = require('../lib/clients/oAuthClient.js').getBearerToken;
const router = require('express').Router();

const twitterConsumerKey = config.get('twitter.key');
const twitterConsumerSecret = config.get('twitter.secret');
const tableName = config.get('aws.tableName');
const region = config.get('aws.region');

const docClient = new AWS.DynamoDB.DocumentClient({
  region
});

router.use(cookieParser());

function saveTweet(userName, tweet, callback) {
  const tweetObject = {
    tweetId: tweet.id_str,
    savedBy: userName,
    savedTime: Date.now(),
    showInTicker: false,
    tweet
  };

  const params = {
    TableName: tableName,
    Item: tweetObject
  };

  docClient.put(params, callback);
}

function getScreenName(client, callback) {
  client.get('account/verify_credentials', (error, userProfile) => {
    if (error) return callback(error);
    callback(null, userProfile.screen_name);
  });
}

function authenticateUser(client, isLoggedIn, screenName, callback) {
  if (!isLoggedIn) {
    if (!screenName) {
      callback(new Error('Not authenticated'));
    } else {
      callback(null, screenName);
    }
  } else {
    getScreenName(client, callback);
  }
}

function getTwitterClient(accessTokenKey, accessTokenSecret, callback) {
  const isLoggedIn = accessTokenKey && accessTokenSecret;
  if (isLoggedIn) {
    callback(null,
      new Twitter({
        consumer_key: twitterConsumerKey,
        consumer_secret: twitterConsumerSecret,
        access_token_key: accessTokenKey,
        access_token_secret: accessTokenSecret
      })
    );
  } else {
    getBearerToken((err, accessToken) => {
      if (err) callback(err);
      callback(null,
        new Twitter({
          consumer_key: twitterConsumerKey,
          consumer_secret: twitterConsumerSecret,
          bearer_token: accessToken
        })
      );
    });
  }
}

function getTweet(tweetId, client, callback) {
  client.get('statuses/show', {
    id: tweetId
  }, callback);
}

router.post('/shortlist/:tweetId', (req, res) => {
  const accessTokenKey = _.get(req, 'cookies.accesstoken');
  const accessTokenSecret = _.get(req, 'cookies.accesstokensecret');
  const screenName = _.get(req, 'query.screenName');
  const tweetId = _.get(req, 'params.tweetId');

  const isLoggedIn = accessTokenKey && accessTokenSecret;

  if (!tweetId) return res.render('timeline', {
    error: {
      heading: 'No Tweet ID',
      hint: 'Please make sure you selected a tweet to shortlist.'
    }
  });

  async.waterfall([
    (cb) => {
      getTwitterClient(accessTokenKey, accessTokenSecret, cb);
    },
    (client, cb) => {
      authenticateUser(client, isLoggedIn, screenName, (err, screenName) => {
        if (err) cb(err);
        cb(null, client, screenName);
      });
    },
    (client, screenName, cb) => {
      getTweet(tweetId, client, (err, tweet) => {
        if (err) return cb(err);
        cb(null, screenName, tweet);
      });
    },
    (screenName, tweet, cb) => {
      saveTweet(screenName, tweet, cb);
    }
  ], (error, data) => {
    if (error) {
      if (_.get(error, 'message') === 'Not authenticated') {
        res.redirect('/login');
      }
      return res.status(500).json(error);
    } else {
      return res.send(200);
    }
  });
});

module.exports = router;
