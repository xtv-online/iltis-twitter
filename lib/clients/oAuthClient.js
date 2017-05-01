'use strict';

const OAuth = require('oauth').OAuth;
const OAuth2 = require('oauth').OAuth2;
const config = require('config');

const twitterConsumerKey = config.get('twitter.key');
const twitterConsumerSecret = config.get('twitter.secret');
const host = config.get('host');

function getBearerToken(callback) {
  const oauth2 = new OAuth2(
    twitterConsumerKey,
    twitterConsumerSecret,
    'https://api.twitter.com/',
    null,
    'oauth2/token',
    null);

  oauth2.getOAuthAccessToken(
    '', {
      'grant_type': 'client_credentials'
    },
    (err, accessToken) => {
      if (err) callback(err);
      callback(err, accessToken);
    });
}

module.exports = {
  client: new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    twitterConsumerKey,
    twitterConsumerSecret,
    '1.0',
    host + '/callback',
    'HMAC-SHA1'
  ),
  getBearerToken
};
