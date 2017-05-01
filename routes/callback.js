'use strict';

const async = require('async');
const nodeUrl = require('url');
const router = require('express').Router();
const oa = require('../lib/clients/oAuthClient.js').client;

router.get('/callback', (req, res) => {
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
    }
  ], (err) => {
    if (err) return err;
  });
});

module.exports = router;
