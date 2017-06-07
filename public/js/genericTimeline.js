function addToShortlist(tweetId) {
  $.post('/shortlist/' + tweetId, function (data) {});
}

function removeFromShortlist(tweetId) {
  console.log(tweetId);
  $.ajax({
    type: "DELETE",
    url: '/shortlist/' + tweetId,
    success: function (data) {
      location.reload();
    }
  });
}
