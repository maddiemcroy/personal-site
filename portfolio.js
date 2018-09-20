var works = [];
var filteredWorks = [];
var worksDict = {};
var allTags = [];
var allTools = [];
var activeTags = [];
var imgSrc;
var tempColor;

function ajaxCall() {
    $.ajax({
        dataType: "json",
        url: "portfolio-works/works.json",
        success: function(data) {
        console.log(data);
          for (var i = 0; i < data.length; i++) {
            works.push(data[i]);
            worksDict[data[i].id] = data[i];
            console.log(data[i].categories);
            for (var j = 0; j < data[i].categories.length; j++) {
                if (!allTags.includes(data[i].categories[j])) {
                    allTags.push(data[i].categories[j]);
                }
            }
            for (var j = 0; j < data[i].tools.length; j++) {
                if (!allTools.includes(data[i].tools[j])) {
                    allTools.push(data[i].tools[j]);
                }
            }
          }
        },
        error: function(data, excep) {
            console.log("error!");
            console.log(data);
            console.log(excep);
        },
        async: false
    });
}

function showDetails(workid) {
    var work = worksDict[workid];

    document.getElementById('img-holder').innerHTML = "<a href=\"" + work.viewPath + "\"><img src=\"" + work.path + "\" style=\"width: 100%\" /><br/><p class=\"date-tools\" style=\"text-align: center\">click to view (" + work.linkDest + ")</p></a>";
    document.getElementById('content-holder').innerHTML = "<h2 class=\"name\">" + work.name + "</h2>"
        + "<p class=\"date-tools\">" + work.dateCreated + " | " + work.tools + "</p>"
        + "<p class=\"desc\">" + work.description + "</p>";

    $('#myModal').modal('show');
}

function loadTiles(set) {
    console.log(set);
    var str = "";
    for (var i = 0; i < set.length; i++) {
        str += ("<div class=\"tile\" onclick=\"showDetails('" + set[i].id + "')\">"
            + "<p class=\"tile-text\" id=\"tile-text-" + set[i].id + "\">" + set[i].name + "</p>"
            + "<div class=\"tile-overlay\"></div>"
            + "<img src='" + set[i].path + "' class='tile-img'></div>");
    }
    document.getElementById('list-view').innerHTML = str;
    $('#list-view').fadeIn();
}

function loadTags() {
    var str = "categories: ";
    for (var i = 0; i < allTags.length; i++) {
        str += ("<p class=\"tag\" onclick=\"toggleTag(this)\">" + allTags[i] + "</p>");
    }
    document.getElementById('categories').innerHTML = str;
}

function loadTools() {
    var str = "tools: ";
    for (var i = 0; i < allTools.length; i++) {
        str += ("<p class=\"tag\" onclick=\"toggleTag(this)\">" + allTools[i] + "</p>");
    }
    document.getElementById('tools').innerHTML = str;
}

function toggleTag(tag) {
    $('#list-view').toggle();
    console.log(works);
    if (tag.style.opacity == 1) {
        tag.removeAttribute("style");
        activeTags = activeTags.filter(e => e !== tag.innerHTML);
        $('.tag').css('pointer-events', 'initial');
    } else {
        tag.style.opacity = 1;
        $('.tag').css('pointer-events', 'none');
        tag.style.pointerEvents = 'initial';
        activeTags.push(tag.innerHTML);
    }
    filterWorks();
}


function filterWorks() {
    filteredWorks = [];
    if (activeTags.length == 0) {
        loadTiles(works);
    } else {
        for (var i = 0; i < works.length; i++) {
            for (var j = 0; j < activeTags.length; j++) {
                if (works[i].categories.includes(activeTags[j])
                    || works[i].tools.includes(activeTags[j]) && !(works[i] in filteredWorks)) {
                    filteredWorks.push(works[i]);
                    console.log(filteredWorks);
                } else {
                    filteredWorks = filteredWorks.filter(e => e !== works[i]);
                    console.log(filteredWorks);
                }
            }
        }
        loadTiles(filteredWorks);
    }
}

$(document).ready(function() {
    ajaxCall();
    console.log(works);
    $(document).ajaxComplete(loadTiles(works));
    loadTags();
    loadTools();

  $('.tile').mouseover(function() {
      $(this).children(".tile-overlay").stop().fadeTo(400, 0.8);
      $(this).children(".tile-text").stop().fadeTo(400, 1);
  });
  $('.tile').mouseout(function() {
      this.children[0].style.display = "none";
      this.children[1].style.display = "none";
  });

});
