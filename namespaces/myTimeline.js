'use strict';

function eventHandler(client, data) {}

function disconnectHandler(client) {}

function connectionHandler(client) {
  client.on('event', (data) => {
    eventHandler(client, data);
  });
}

module.exports = {
  name: 'myTimeline',
  connection: connectionHandler,
  disconnect: disconnectHandler
};
