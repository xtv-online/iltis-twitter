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
  ], (err, res) => {
    if (err) return (err);
  });
});

module.exports = router;
