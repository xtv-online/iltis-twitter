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

router.get('/search', (req, res) => {

  const accessTokenKey = _.get(req, 'cookies.accesstoken');
  const accessTokenSecret = _.get(req, 'cookies.accesstokensecret');
  const searchTerm = _.get(req, 'query.q');

  if (!accessTokenKey && !accessTokenSecret) return res.redirect('/');

  if (!searchTerm) return res.render('timeline', {
    error: {
      heading: 'No search term',
      hint: 'You gotta search for something!'
    },
    partials
  });

  const client = new Twitter({
    consumer_key: twitterConsumerKey,
    consumer_secret: twitterConsumerSecret,
    access_token_key: accessTokenKey,
    access_token_secret: accessTokenSecret
  });

  client.get('search/tweets', {
    q: searchTerm,
    count: 100
  }, (error, tweets) => {
    if (error) {
      return res.end(JSON.stringify(error));
    }

    const tweetView = tweets.statuses.map((tweet) => {
      return {
        username: tweet.user.screen_name,
        tweettext: tweet.text
      };
    });

    res.render('timeline', {
      tweets: tweetView,
      searchTerm,
      partials
    });
  });
});

module.exports = router;
