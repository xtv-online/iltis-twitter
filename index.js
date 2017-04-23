'use strict';

const config = require('config');
const oa = require('./lib/clients/oAuthClient.js')
const nodeUrl = require('url');
const async = require('async');
const _ = require('lodash');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const Twitter = require('twitter');

const twitterConsumerKey = config.get('twitter.key');
const twitterConsumerSecret = config.get('twitter.secret');

app.use(cookieParser());

app.get('/', (req, res) => {
  const accessTokenKey = _.get(req, 'cookies.accesstoken');
  const accessTokenSecret = _.get(req, 'cookies.accesstokensecret');

  if (accessTokenKey && accessTokenSecret) {
    return res.redirect('/homeTimeline')
  } else {
    return res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  async.waterfall([
    (cb) => {
      oa.getOAuthRequestToken(cb);
    },
    (oAuthToken, oAuthTokenSecret, results, cb) => {
      const authURL = 'https://twitter.com/oauth/authenticate?oauth_token=' + oAuthToken;
      res.redirect(authURL);
      cb(null, null)
    }
  ], (err, res) => {
    if (err) return (err);
  });
});

app.get('/callback', (req, res) => {
  const urlObj = nodeUrl.parse(req.url, true);

  async.waterfall([
    (cb) => {
      oa.getOAuthRequestToken(cb);
    },
    (oAuthToken, oAuthTokenSecret, results, cb) => {
      oa.getOAuthAccessToken(urlObj.query.oauth_token, oAuthTokenSecret, urlObj.query.oauth_verifier, cb);
    },
    (oAuthAccessToken, oAuthAccessTokenSecret, result, cb) => {
      res.cookie('accesstoken', oAuthAccessToken);
      res.cookie('accesstokensecret', oAuthAccessTokenSecret);
      res.redirect('/homeTimeline');
      cb(null, null);
    },
  ], (err, results) => {
    if (err) return err;
  });
});

app.get('/homeTimeline', (req, res) => {

  const accessTokenKey = _.get(req, 'cookies.accesstoken');
  const accessTokenSecret = _.get(req, 'cookies.accesstokensecret');

  if (!accessTokenKey && !accessTokenSecret) return res.redirect('/');

  const client = new Twitter({
    consumer_key: twitterConsumerKey,
    consumer_secret: twitterConsumerSecret,
    access_token_key: accessTokenKey,
    access_token_secret: accessTokenSecret
  });

  client.get('statuses/home_timeline', {
    count: 200
  }, (error, tweets, response) => {
    if (error) throw error;

    let tweetview = '<html><head></head><body><ul>';
    for (const tweet of tweets) {
      tweetview += `<li><strong>${tweet.user.screen_name}:</strong> ${tweet.text}</li>`
    }

    tweetview += '</ul></body></html>'
    res.end(tweetview);
  });

})

app.listen(3000, () => {
  console.log('Collator listening on port 3000!')
});
