'use strict';

const express = require('express');
const app = express();
const Filehound = require('filehound');

function loadRoutes(routeDir) {
  const routes = Filehound.create()
    .path(routeDir)
    .ext('js')
    .findSync();

  routes.forEach((route) => {
    app.use('/', require(route));
  });
}

loadRoutes(__dirname + '/routes/');

app.listen(3000, () => {
  console.log('Collator listening on port 3000!')
});
