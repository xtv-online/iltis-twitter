'use strict';

const config = require('config');
const OAuth = require('oauth').OAuth;
const nodeUrl = require('url');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const Twitter = require('twitter');

app.use(cookieParser());

const twitterConsumerKey = config.get('twitter.key');
const twitterConsumerSecret = config.get('twitter.secret');

const oa = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  twitterConsumerKey,
  twitterConsumerSecret,
  '1.0',
  '',
  'HMAC-SHA1'
);
oa.getOAuthRequestToken((error, oAuthToken, oAuthTokenSecret, results) => {
  app.get('/', (req, res) => {

    const urlObj = nodeUrl.parse(req.url, true);
    const authURL = 'https://twitter.com/' +
      'oauth/authenticate?oauth_token=' + oAuthToken;

    const body = '<a href="' + authURL + '"> Get Code </a>';
    res.writeHead(200, {
      'Content-Length': body.length,
      'Content-Type': 'text/html'
    });
    res.end(body);

  });

  app.get('/callback', (req, res) => {
    const urlObj = nodeUrl.parse(req.url, true);
    const getOAuthRequestTokenCallback = (error, oAuthAccessToken,
      oAuthAccessTokenSecret, results) => {
      if (error) {
        console.log(error);
        res.end(JSON.stringify({
          message: 'Error occured while getting access token',
          error: error
        }));
        return;
      }

      oa.get('https://api.twitter.com/1.1/account/verify_credentials.json',
        oAuthAccessToken,
        oAuthAccessTokenSecret,
        (error, twitterResponseData, result) => {
          if (error) {
            console.log(error)
            res.end(JSON.stringify(error));
            return;
          }
          res.cookie('accesstoken', oAuthAccessToken);
          res.cookie('accesstokensecret', oAuthAccessTokenSecret);
          res.redirect('/homeTimeline');
        });
    };

    oa.getOAuthAccessToken(urlObj.query.oauth_token, oAuthTokenSecret,
      urlObj.query.oauth_verifier,
      getOAuthRequestTokenCallback);
  });

  app.get('/homeTimeline', (req, res) => {
    const client = new Twitter({
      consumer_key: twitterConsumerKey,
      consumer_secret: twitterConsumerSecret,
      access_token_key: req.cookies.accesstoken,
      access_token_secret: req.cookies.accesstokensecret
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
    console.log('Example app listening on port 3000!')
  });
});
