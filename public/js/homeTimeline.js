var socket = io('/homeTimeline');

var accessTokenKey = Cookies.get('accesstoken');
var accessTokenSecret = Cookies.get('accesstokensecret');

socket.emit('event', {
  type: 'auth',
  accessTokenKey: accessTokenKey,
  accessTokenSecret: accessTokenSecret
});

socket.on('event', (data) => {
  switch (data.type) {
    case 'tweet':
      console.log('got tweet', data.tweet)
      break;

    default:
      break;
  }
})
