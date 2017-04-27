//To-do
//1.  Drop values whose weight calculation is < 0

//Get a list of project IDs from the accounts/projects list
var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
}

var hostNameLength = window.location.hostname.length + 18;
var projectList = [];
for (var i = 0; i < document.getElementsByClassName("project_name").length; i++) {
    projectList.push(document.getElementsByClassName("project_name")[i].toString().slice(hostNameLength));
}

getProjectActivity(projectList, 500); //500 is the limit per the API


//Get a list of acitivies on each project
function getProjectActivity(projectList, maxActivity) {
    if (projectList.length > 400) {
        console.log("Are you CRAZY?!?  That's too many projects.")
        return;
    }
    var activityPerProject = [];
    for (var i = 0; i < projectList.length; i++) {
        var client = new HttpClient();
        client.get('https://' + window.location.hostname + '/services/v5/projects/' + projectList[i] + '/activity?fields=occurred_at,project(name)&limit=' + maxActivity, function(response) {
            activityPerProject.push(JSON.parse(response));
            if (activityPerProject.length === projectList.length) {
                scoreProjects(activityPerProject, 182);
            }
        });
    }
}

//Give the projects a score: weight (configurable) - days between now and each activity
function scoreProjects(activityPerProject, weight) {
    var today = new Date();
    var results = [];
    for (var i = 0; i < activityPerProject.length; i++) {
        if (activityPerProject[i].length !== 0) { //don't look at projects with no activity
            results[i] = {
                "id": activityPerProject[i][0].project.id,
                "name": activityPerProject[i][0].project.name,
                "score": 0
            };
            for (var j = 0; j < activityPerProject[i].length; j++) {
                results[i].score += weight - Math.floor((today - new Date(activityPerProject[i][j].occurred_at)) / (1000 * 60 * 60 * 24));
            }
        }
    }
    var sorted = results.sort(function(a, b) {
        return b.score - a.score;
    });
    console.log(sorted); //show results in the console
};
