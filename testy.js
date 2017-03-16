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
var userId = "";
var projectRole = "";
var accountRole = "";
//Display a link to GitHub using the environment's SHA
$(".metrics").append('<tr><th>Git SHA</th><th><a href="https://github.com/pivotaltracker/tracker/commits/' + window.FRONTEND_FLAGS.git_sha + '" target="_blank">' + window.FRONTEND_FLAGS.git_sha + '</a></th></tr>');

//Display the user's ID, API Token, and Capabilities
$.get('https://' + hostname + '/services/v5/me?fields=capabilities,id,api_token', function(data) {
    userId = JSON.stringify(data.id);
    $(".metrics").append('<tr><th>User ID</th><th>' + userId + '</th></tr>');
    $(".metrics").append('<tr><th>API Token</th><th>' + data.api_token + '</th></tr>');
    apiToken = data.api_token;
    //See if person has capabilities
    if (data.capabilities) {
        var personCapabilities = Object.keys(data.capabilities);
        personCapabilities.map(function(item) {
            $(".metrics").append('<tr><th>Person Capability</th><th>' + item + '</th></tr>');
        });
    }
    //Display the project's capabilities, account ID, and project id
    $.get('https://' + hostname + '/services/v5/projects/' + window.location.pathname.split('/').pop() + '?fields=capabilities,account_id,id', function(data) {
        $(".metrics").append('<tr><th>Account ID</th><th>' + data.account_id + '</th></tr>');
        $(".metrics").append('<tr><th>Project ID</th><th>' + data.id + '</th></tr>')
        requestAccountRole(hostname, data.account_id, userId);
        //See if project has capabilities
        if (data.capabilities) {
            var projectCapabilities = Object.keys(data.capabilities);
            projectCapabilities.map(function(item) {
                $(".metrics").append('<tr><th>Project Capability</th><th>' + item + '</th></tr>');
            });
        }
    });
    //  Display the user's project role
    requestProjectRole(hostname)
});



//Add templates to the table with clickable links
function addTemplates(templates) {
    $.each(templates, function(key, value) {
        $(".metrics").append('<tr><th>' + key + '</th><th><a style="text-decoration: underline; color: blue;" onclick="createStory(' + value + ')">Add</a></th></tr>');
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
                url: 'https://' + hostname + '/services/v5/projects/' + window.location.pathname.split('/').pop() + '/stories',
                data: result,
                headers: {
                    "X-TrackerToken": apiToken
                }
            });
        }
    });
};
//Rquests and creates the account role
function requestAccountRole(hostname, accountID, userID) {
    var accountRole = "";
    $.ajax({
        type: "get",
        url: 'https://' + hostname + '/services/v5/account_summaries?fields=id,permissions,owner_id,admin_ids,is_enterprise_guest',
        success: function(result) {
            result.forEach(function(item, index) {
                if (item.id === accountID) {
                    if (item.owner_id == userID) {
                        accountRole = "Owner"
                    } else if ($.inArray(userID, item.admin_ids) !== -1) {
                        accountRole = "Admin"
                    } else if (item.is_enterprise_guest === true) {
                        accountRole = "Enterprise Guest"
                    } else {
                        accountRole = "Member"
                    }
                    if (item.permissions.includes("project_creation")) {
                        accountRole += " & Project Creator";
                    }
                }
            });
            $(".metrics").append('<tr><th>Account Role</th><th>' + accountRole + '</th></tr>')
        }
    });
}
//Request and display a user's project role
function requestProjectRole(hostname){
  $.ajax({
      type: "get",
      url: 'https://' + hostname + '/services/v5/projects/' + window.location.pathname.split('/').pop() + '?fields=capabilities,account_id,id,memberships(role,person)',
      success: function(result) {
          result.memberships.forEach(function(item, index) {
              if (item.person.id == userId) {
                  projectRole = item.role;
              }
          });
          $(".metrics").append('<tr><th>Project Role</th><th>' + projectRole + '</th></tr>');
      }
  });
}
