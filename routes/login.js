'use strict';

const async = require('async');
const router = require('express').Router();
const oa = require('../lib/clients/oAuthClient.js');

router.get('/login', (req, res) => {
  async.waterfall([
    (cb) => {
      oa.getOAuthRequestToken(cb);
    },
    (oAuthToken, oAuthTokenSecret, results, cb) => {
      const authURL = 'https://twitter.com/oauth/authenticate?oauth_token=' + oAuthToken;
      res.redirect(authURL);
      cb(null, null);
    }
  ], (err) => {
    if (err) {
      res.status(500);
      res.end(JSON.stringify({
        error: err
      }));
    }
  });
});

module.exports = router;
