$(document).ready(function () {
  var socket = io('/homeTimeline');

  var accessTokenKey = Cookies.get('accesstoken');
  var accessTokenSecret = Cookies.get('accesstokensecret');

  function addTweet(tweet) {
    $('#xtc-tweets').prepend('<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3"> <div class="card xtc-tweet-card mt-3"> <div class="card-block" id="tweet-' + tweet.id_str + '"><h4 class="card-title">' + tweet.user.screen_name + '</h4><p class="card-text">' + tweet.text + '</p><a href="#" class="btn btn-primary" onclick="addToShortlist(\'' + tweet.id_str + '\');">Shortlist</a></div></div></div>');
  }

  function showError(error) {
    $('#xtc-tweets').before('<div class="alert alert-danger" role="alert"><h4 class="alert-heading">Error</h4>' + error + '</div>');
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
      case 'error':
        showError(data.error);
        break;
      default:
        break;
    }
  })

});

function addToShortlist(tweetId) {
  $.post('/shortlist/' + tweetId, function (data) {});
}
