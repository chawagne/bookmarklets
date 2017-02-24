//Get the document ready
$("body").append('<div class="stats" style="width:350px"><h2 class="title">Testy - Your Testing Buddy</h2><table class="metrics" style="width:350px"></table>');
$(document).on("click", function(e) {
    if ($(e.target).parent().attr('class') === 'stats') {
        $(".stats").remove();
    }
});
//Get the hostname
var hostname = window.location.hostname;

//Display a link to GitHub using the environment's SHA
$(".metrics").append('<tr><th>Git SHA</th><th><a href="https://github.com/pivotaltracker/tracker/commits/'+window.FRONTEND_FLAGS.git_sha+'" target="_blank">'+window.FRONTEND_FLAGS.git_sha+'</a></th></tr>');

//Display the user's ID, API Token, and Capabilities
$.get('https://' + hostname + '/services/v5/me?fields=capabilities,id,api_token', function(data) {
  $(".metrics").append('<tr><th>User ID</th><th>' + JSON.stringify(data.id) + '</th></tr>');
  $(".metrics").append('<tr><th>API Token</th><th>' + data.api_token + '</th></tr>');
  console.log(data);
  var capabilities = Object.keys(data.capabilities);
  capabilities.map(function(item) {
      $(".metrics").append('<tr><th>Person Capability</th><th>' + item + '</th></tr>');
  });
});

//Display the project's capabilities
$.get('https://' + hostname + '/services/v5/projects/' + window.location.pathname.split('/').pop() + '?fields=capabilities', function(data) {
    var capabilities = Object.keys(data.capabilities);
    capabilities.map(function(item) {
        $(".metrics").append('<tr><th>Project Capability</th><th>' + item + '</th></tr>');
    });
});
