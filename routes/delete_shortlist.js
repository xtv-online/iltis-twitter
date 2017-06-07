'use strict';

const config = require('config');
const cookieParser = require('cookie-parser');
const AWS = require('aws-sdk');
const _ = require('lodash');
const router = require('express').Router();

const tableName = config.get('aws.tableName');
const region = config.get('aws.region');

const docClient = new AWS.DynamoDB.DocumentClient({
  region
});

router.use(cookieParser());

function deleteTweet(tweetId, cb) {
  const params = {
    TableName: tableName,
    Key: {
      tweetId
    }
  };

  docClient.delete(params, cb);
}

router.delete('/shortlist/:tweetId', (req, res) => {
  const tweetId = _.get(req, 'params.tweetId');

  if (!tweetId) return res.status(500);
  deleteTweet(tweetId, (err) => {
    if (err) return res.sendStatus(500);
    return res.sendStatus(204);
  });
});

module.exports = router;
