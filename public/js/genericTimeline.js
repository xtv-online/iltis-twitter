function addToShortlist(tweetId) {
  $.post('/shortlist/' + tweetId, function (data) {});
}
