'use strict';

const config = require('config');
const Twitter = require('twitter');

const twitterConsumerKey = config.get('twitter.key');
const twitterConsumerSecret = config.get('twitter.secret');

function subscribe(socket, accessTokenKey, accessTokenSecret) {
  const client = new Twitter({
    consumer_key: twitterConsumerKey,
    consumer_secret: twitterConsumerSecret,
    access_token_key: accessTokenKey,
    access_token_secret: accessTokenSecret
  });

  const stream = client.stream('user', {
    track: 'javascript'
  });

  stream.on('data', (event) => {
    socket.emit('event', {
      type: 'tweet',
      tweet: event
    });
  });

  stream.on('error', (error) => {
    console.log(error);
  });
}

function eventHandler(socket, data) {
  switch (data.type) {
    case 'auth':
      if (data.accessTokenKey && data.accessTokenSecret) {
        subscribe(socket, data.accessTokenKey, data.accessTokenSecret);
      }
      break;
    default:
      console.log('unsupported message');
      break;
  }
}

function disconnectHandler(socket) {
  console.log('disconnected', socket);
}

function connectionHandler(socket) {
  socket.on('event', eventHandler.bind(null, socket));
}

module.exports = {
  name: 'homeTimeline',
  connection: connectionHandler,
  disconnect: disconnectHandler
};
