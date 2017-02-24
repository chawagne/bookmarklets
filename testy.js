$("body").append('<div class="stats"><h2 class="title">Testy - Your Testing Buddy</h2><table class="metrics"></table>');
$(document).on("click", function(e) {
    if ($(e.target).parent().attr('class') === 'stats') {
        $(".stats").remove();
    }
});
var hostname = window.location.hostname;


$(".metrics").append('<tr><th>Git SHA</th><th><a href="https://github.com/pivotaltracker/tracker/commits/'+window.FRONTEND_FLAGS.git_sha+'" target="_blank">'+window.FRONTEND_FLAGS.git_sha.substr(0,8)+'</a></th></tr>');

$.get('https://' + hostname + '/services/v5/me', function(data) {
  $(".metrics").append('<tr><th>User ID</th><th>' + JSON.stringify(data.id) + '</th></tr>');
});

$.get('https://' + hostname + '/services/v5/me?fields=capabilities', function(data) {
    var capabilities = Object.keys(data.capabilities);
    console.log(capabilities);
    capabilities.map(function(item) {
        $(".metrics").append('<tr><th>Person Capability</th><th>' + item + '</th></tr>');
    });
    $(".metrics").append('<tr><td><hr></td></tr>');
});
$.get('https://' + hostname + '/services/v5/projects/' + window.location.pathname.split('/').pop() + '?fields=capabilities', function(data) {
    var capabilities = Object.keys(data.capabilities);
    console.log(capabilities);
    capabilities.map(function(item) {
        $(".metrics").append('<tr><th>Project Capability</th><th>' + item + '</th></tr>');
    });
    $(".metrics").append('<tr><td><hr></td></tr>');
});
