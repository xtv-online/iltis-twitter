'use strict';

function eventHandler(client, data) {}

function disconnectHandler(client) {}

function connectionHandler(client) {
  client.on('event', eventHandler.bind(null, client));
}

module.exports = {
  name: 'myTimeline',
  connection: connectionHandler,
  disconnect: disconnectHandler
};
