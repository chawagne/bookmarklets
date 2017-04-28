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
    tableCreate(sorted);
    //console.log(sorted); //show results in the console
};


function tableCreate(sortedProjects){
    var body = document.body,
        tbl  = document.createElement('table');
    tbl.style.position = 'absolute';
    tbl.style.left = '350px';
    tbl.style.top = '50px';
    tbl.style.zIndex = '999';
    tbl.style.backgroundColor = '#ddd'

    for(var i = 0; i < sortedProjects.length; i++){
      if (!(sortedProjects[i] === undefined)){
        var tr = tbl.insertRow();
        for(var j = 0; j < 2; j++){
                var td = tr.insertCell();
              if (j===0){
                td.appendChild(document.createTextNode(sortedProjects[i].name));
                }
              else {
                td.appendChild(document.createTextNode(Math.round((sortedProjects[i].score/sortedProjects[0].score)*100)+"% of top project"));
              }
                td.style.border = '1px solid black';
                td.style.fontSize = "20px"

        }
    }
  }

    body.appendChild(tbl);
}

