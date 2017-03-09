
//Get the document ready
$("body").append('<div class="stats" style="width:370px"><h2 class="title">Testy - Your Testing Buddy</h2><table class="metrics" style="width:370px"></table>');
$(document).on("click", function(e) {
    if ($(e.target).parent().attr('class') === 'stats') {
        $(".stats").remove();
    }
});
//Get the hostname
var hostname = window.location.hostname;

//List template names and their IDs.  Add to this if you want more templates.
var templates = {
  "Markdown Template": 141337111,
  "Markdown Emoji Template": 141337107,
  "All Emoji Template": 141337105
};

//Display the templates
addTemplates(templates);

var apiToken = "";
//Display a link to GitHub using the environment's SHA
$(".metrics").append('<tr><th>Git SHA</th><th><a href="https://github.com/pivotaltracker/tracker/commits/'+window.FRONTEND_FLAGS.git_sha+'" target="_blank">'+window.FRONTEND_FLAGS.git_sha+'</a></th></tr>');

//Display the user's ID, API Token, and Capabilities
$.get('https://' + hostname + '/services/v5/me?fields=capabilities,id,api_token', function(data) {
  $(".metrics").append('<tr><th>User ID</th><th>' + JSON.stringify(data.id) + '</th></tr>');
  $(".metrics").append('<tr><th>API Token</th><th>' + data.api_token + '</th></tr>');
  apiToken = data.api_token;
  var capabilities = Object.keys(data.capabilities);
  capabilities.map(function(item) {
      $(".metrics").append('<tr><th>Person Capability</th><th>' + item + '</th></tr>');
  });
});

//Display the project's capabilities, account ID, and project id
$.get('https://' + hostname + '/services/v5/projects/' + window.location.pathname.split('/').pop() + '?fields=capabilities,account_id,id', function(data) {
    $(".metrics").append('<tr><th>Account ID</th><th>' + data.account_id + '</th></tr>');
    $(".metrics").append('<tr><th>Project ID</th><th>' + data.id + '</th></tr>')
    var capabilities = Object.keys(data.capabilities);
    capabilities.map(function(item) {
        $(".metrics").append('<tr><th>Project Capability</th><th>' + item + '</th></tr>');
    });
});

//Add templates to the table with clickable links
function addTemplates(templates){
  $.each(templates, function (key,value){
    $(".metrics").append('<tr><th>'+key+'</th><th><a style="text-decoration: underline; color: blue;" onclick="createStory('+value+')">Add</a></th></tr>');
  })
};

//Create a story from a template
function createStory(storyId) {
    $.ajax({
        type: "get",
        url: 'https://www.pivotaltracker.com/services/v5/projects/1986395/stories/' + storyId + '?fields=kind,story_type,name,description',
        success: function(result) {
            $.ajax({
                type: "post",
                url: 'https://'+ hostname +'/services/v5/projects/' + window.location.pathname.split('/').pop()+ '/stories',
                data: result,
                headers: {
                    "X-TrackerToken": apiToken
                }
            });
        }
    });
};
