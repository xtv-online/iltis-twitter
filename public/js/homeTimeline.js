$(document).ready(function () {
  var socket = io('/homeTimeline');

  var accessTokenKey = Cookies.get('accesstoken');
  var accessTokenSecret = Cookies.get('accesstokensecret');

  function addTweet(tweet) {
    $('#xtc-tweets').prepend('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3"> <div class="card xtc-tweet-card mt-3"> <div class="card-block"><h4 class="card-title">' + tweet.user.screen_name + '</h4><p class="card-text">' + tweet.text + '</p><a href="#" class="btn btn-primary">Shortlist</a></div></div></div>');
  }

  socket.emit('event', {
    type: 'auth',
    accessTokenKey: accessTokenKey,
    accessTokenSecret: accessTokenSecret
  });

  socket.on('event', (data) => {
    switch (data.type) {
      case 'tweet':
        addTweet(data.tweet);
        break;

      default:
        break;
    }
  })

});
