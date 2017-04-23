'use strict';

const config = require('config');
const cookieParser = require('cookie-parser');
const _ = require('lodash');
const Twitter = require('twitter');
const router = require('express').Router();

const twitterConsumerKey = config.get('twitter.key');
const twitterConsumerSecret = config.get('twitter.secret');

router.use(cookieParser());

router.get('/homeTimeline', (req, res) => {

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
  }, (error, tweets) => {
    if (error) throw error;

    let tweetview = '<html><head></head><body><ul>';
    for (const tweet of tweets) {
      tweetview += `<li><strong>${tweet.user.screen_name}:</strong> ${tweet.text}</li>`;
    }

    tweetview += '</ul></body></html>';
    res.end(tweetview);
  });
});

module.exports = router;
