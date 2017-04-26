'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const Filehound = require('filehound');
const io = require('socket.io')(server);

io.on('connection', (client) => {
  client.on('event', (data) => {
    console.log(data);
  });
  client.on('disconnect', () => {
    console.log('disconnect');
  });
});

function loadRoutes(routeDir) {
  const routes = Filehound.create()
    .path(routeDir)
    .ext('js')
    .findSync();

  routes.forEach((route) => {
    app.use('/', require(route));
  });
}

function loadNamespaces(namespaceDir) {
  const namespaces = Filehound.create()
    .path(namespaceDir)
    .ext('js')
    .findSync();

  namespaces.forEach((namespace) => {
    const nspListener = require(namespace);
    const nsp = io.of(nspListener.name);
    nsp.on('connection', nspListener.connection);
    nsp.on('disconnect', nspListener.disconnect);
  });
}

loadRoutes(__dirname + '/routes/');
loadNamespaces(__dirname + '/namespaces/');

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

server.listen(3000, () => {
  console.log('Collator listening on port 3000!');
});
