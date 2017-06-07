'use strict';

const config = require('config');
const AWS = require('aws-sdk');
const _ = require('lodash');
const router = require('express').Router();

const tableName = config.get('aws.tableName');
const region = config.get('aws.region');

const docClient = new AWS.DynamoDB.DocumentClient({
  region
});

function getShortlist(callback) {
  const params = {
    TableName: tableName
  };
  docClient.scan(params, callback);
}

router.get('/api/shortlist', (req, res) => {

  getShortlist((err, data) => {
    if (err) return res.status(500);

    const tweets = data.Items.map((item) => {
      return {
        savedByName: _.get(item, 'savedBy'),
        tweetId: _.get(item, 'tweetId'),
        userName: _.get(item, 'tweet.user.screen_name'),
        tweetText: _.get(item, 'tweet.text')
      };
    });
    return res.json(tweets);
  });
});

module.exports = router;
