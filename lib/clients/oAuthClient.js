'use strict';

const OAuth = require('oauth').OAuth;
const config = require('config');

const twitterConsumerKey = config.get('twitter.key');
const host = config.get('host');
const twitterConsumerSecret = config.get('twitter.secret');

module.exports = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  twitterConsumerKey,
  twitterConsumerSecret,
  '1.0',
  host + '/callback',
  'HMAC-SHA1'
);
