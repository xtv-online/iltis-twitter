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

router.get('/user', (req, res) => {

  const accessTokenKey = _.get(req, 'cookies.accesstoken');
  const accessTokenSecret = _.get(req, 'cookies.accesstokensecret');
  const username = _.get(req, 'query.id');

  if (!accessTokenKey && !accessTokenSecret) return res.redirect('/');

  if (!username) return res.render('timeline', {
    error: {
      heading: 'No username',
      hint: 'You gotta enter a username!'
    },
    partials
  });

  const client = new Twitter({
    consumer_key: twitterConsumerKey,
    consumer_secret: twitterConsumerSecret,
    access_token_key: accessTokenKey,
    access_token_secret: accessTokenSecret
  });

  client.get('statuses/user_timeline', {
    screen_name: username,
    count: 200
  }, (error, tweets) => {
    if (error) {
      return res.end(JSON.stringify(error));
    }

    const tweetView = tweets.map((tweet) => {
      return {
        tweetid: tweet.id_str,
        username: tweet.user.screen_name,
        tweettext: tweet.text
      };
    });

    res.render('timeline', {
      tweets: tweetView,
      clientjs: 'genericTimeline',
      partials
    });
  });
});

module.exports = router;
