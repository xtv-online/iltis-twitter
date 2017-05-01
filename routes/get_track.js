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

router.get('/track', (req, res) => {

  const accessTokenKey = _.get(req, 'cookies.accesstoken');
  const accessTokenSecret = _.get(req, 'cookies.accesstokensecret');
  const trackTerm = _.get(req, 'query.q');

  if (!accessTokenKey && !accessTokenSecret) return res.redirect('/');

  if (!trackTerm) return res.render('timeline', {
    error: {
      heading: 'No track term',
      hint: 'Please enter a keyword to track.'
    },
    partials
  });

  res.render('timeline', {
    tweets: [],
    clientjs: 'track',
    info: {
      heading: 'Track requested..',
      hint: `Please wait for tweets for <strong>${trackTerm}</strong> to come in. To search past tweets, use search.
             <br /> For more information please see <a href="https://dev.twitter.com/streaming/overview/request-parameters#track">twitters track documentation</a>.`
    },
    trackTerm,
    partials
  });
});

module.exports = router;
