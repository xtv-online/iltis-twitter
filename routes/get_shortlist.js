'use strict';

const async = require('async');
const config = require('config');
const AWS = require('aws-sdk');
const cookieParser = require('cookie-parser');
const _ = require('lodash');
const router = require('express').Router();

const tableName = config.get('aws.tableName');
const region = config.get('aws.region');

const docClient = new AWS.DynamoDB.DocumentClient({
  region
});

const partials = {
  tweetsCard: 'partials/shortlist-tweet-card'
};

function getShortlist(callback) {
  const params = {
    TableName: tableName
  };

  docClient.scan(params, callback);
}

router.use(cookieParser());

router.get('/shortlist', (req, res) => {
  const accessTokenKey = _.get(req, 'cookies.accesstoken');
  const accessTokenSecret = _.get(req, 'cookies.accesstokensecret');

  if (!accessTokenKey && !accessTokenSecret) return res.redirect('/login');

  async.waterfall([
    getShortlist,
    (data) => {
      const tweetView = data.Items.map((item) => {
        return {
          savedByName: _.get(item, 'savedBy'),
          tweetId: _.get(item, 'tweetId'),
          userName: _.get(item, 'tweet.user.screen_name'),
          tweetText: _.get(item, 'tweet.text')
        };
      });
      res.render('timeline', {
        tweets: tweetView,
        clientjs: 'myTimeline',
        partials
      });
    }
  ], (error) => {
    if (error) {
      res.render('timeline', {
        error: {
          heading: 'Error',
          hint: JSON.stringify(error)
        }
      });
    }
  });
});

module.exports = router;
