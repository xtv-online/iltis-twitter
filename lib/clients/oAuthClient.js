'use strict';

const OAuth = require('oauth').OAuth;
const config = require('config');

const twitterConsumerKey = config.get('twitter.key');
const twitterConsumerSecret = config.get('twitter.secret');

module.exports = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  twitterConsumerKey,
  twitterConsumerSecret,
  '1.0',
  'http://localhost:3000/callback',
  'HMAC-SHA1'
);
