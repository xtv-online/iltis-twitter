'use strict';

const router = require('express').Router();
const _ = require('lodash');

router.get('/status', (req, res) => {
  res.send('OK');
});

module.exports = router;
