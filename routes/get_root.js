'use strict';

const router = require('express').Router();
const _ = require('lodash');

router.get('/', (req, res) => {
  const accessTokenKey = _.get(req, 'cookies.accesstoken');
  const accessTokenSecret = _.get(req, 'cookies.accesstokensecret');

  if (accessTokenKey && accessTokenSecret) {
    return res.redirect('/homeTimeline');
  } else {
    return res.redirect('/login');
  }
});

module.exports = router;
