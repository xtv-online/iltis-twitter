'use strict';

const config = require('config');
const Twitter = require('twitter');

const twitterConsumerKey = config.get('twitter.key');
const twitterConsumerSecret = config.get('twitter.secret');

function subscribe(socket, accessTokenKey, accessTokenSecret, trackTerm) {
  const client = new Twitter({
    consumer_key: twitterConsumerKey,
    consumer_secret: twitterConsumerSecret,
    access_token_key: accessTokenKey,
    access_token_secret: accessTokenSecret
  });

  const stream = client.stream('statuses/filter', {
    track: trackTerm
  });

  stream.on('data', (event) => {
    socket.emit('event', {
      type: 'tweet',
      tweet: event
    });
  });

  stream.on('error', (error) => {
    if (error.source) {
      socket.emit('event', {
        type: 'error',
        error: JSON.stringify(error.source)
      });
    }
    console.log(error);
  });
}

function eventHandler(socket, data) {
  switch (data.type) {
    case 'track':
      if (data.accessTokenKey && data.accessTokenSecret && data.trackTerm) {
        subscribe(socket, data.accessTokenKey, data.accessTokenSecret, data.trackTerm);
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
  name: 'track',
  connection: connectionHandler,
  disconnect: disconnectHandler
};
