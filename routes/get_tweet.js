'use strict';

const config = require('config');
const cookieParser = require('cookie-parser');
const _ = require('lodash');
const Twitter = require('twitter');
const router = require('express').Router();

const twitterConsumerKey = config.get('twitter.key');
const twitterConsumerSecret = config.get('twitter.secret');

const partials = {
  tweetsCard: 'partials/tweets-card'
};

router.use(cookieParser());

router.get('/tweet', (req, res) => {

  const accessTokenKey = _.get(req, 'cookies.accesstoken');
  const accessTokenSecret = _.get(req, 'cookies.accesstokensecret');
  const tweetId = _.get(req, 'query.id');

  if (!accessTokenKey && !accessTokenSecret) return res.redirect('/');

  if (!tweetId) return res.render('timeline', {
    error: {
      heading: 'No tweetId',
      hint: 'You gotta enter a tweet ID!'
    },
    partials
  });

  const client = new Twitter({
    consumer_key: twitterConsumerKey,
    consumer_secret: twitterConsumerSecret,
    access_token_key: accessTokenKey,
    access_token_secret: accessTokenSecret
  });

  client.get('statuses/show', {
    id: tweetId
  }, (error, tweet) => {
    if (error) {
      return res.end(JSON.stringify(error));
    }

    const tweetView = {
      tweetid: tweet.id_str,
      username: tweet.user.screen_name,
      tweettext: tweet.text
    };

    res.render('timeline', {
      tweets: tweetView,
      partials
    });
  });
});

module.exports = router;
