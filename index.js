'use strict';

const express = require('express');
const app = express();
const path = require('path');

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

app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.set('layout', 'layout');
app.set('views', [
  path.resolve(process.cwd(), 'views'), // app-secific views
  path.resolve(__dirname, 'views') // UI layout and partials
]);

app.use(express.static(path.resolve(process.cwd(), 'public'))); // app-specific static assets
app.use(express.static(path.resolve(__dirname, 'public'))); // UI static assets

app.use('/bootstrap', express.static(path.resolve(process.cwd(), 'node_modules/bootstrap/dist')));
app.use('/bootstrap', express.static(path.resolve(__dirname, 'node_modules/bootstrap/dist')));
app.use('/font-awesome', express.static(path.resolve(process.cwd(), 'node_modules/font-awesome')));
app.use('/font-awesome', express.static(path.resolve(__dirname, 'node_modules/font-awesome')));
app.use('/tether', express.static(path.resolve(process.cwd(), 'node_modules/tether/dist')));
app.use('/tether', express.static(path.resolve(__dirname, 'node_modules/tether/dist')));
app.use('/jquery', express.static(path.resolve(process.cwd(), 'node_modules/jquery/dist')));
app.use('/jquery', express.static(path.resolve(__dirname, 'node_modules/jquery/dist')));

app.listen(3000, () => {
  console.log('Collator listening on port 3000!');
});
