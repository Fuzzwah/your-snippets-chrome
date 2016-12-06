function isAuthAvailable(){
  return localStorage.token && localStorage.server;
}

function loginResponse() {
  if (this.readyState == 4) {
    console.log(this.status+' '+statusCodes[this.status]);
    if (this.status == 0) {
      throw('Status = 0');
    } else if (this.status == 200) {
      var storage = chrome.extension.getBackgroundPage().localStorage;
      storage.token = this.response.token;
      $("#save").removeClass("btn-primary").addClass("btn-success");
      $("#save").text("Saved");
      $("#tags-cache").css("display","block");
      return false;

    } else {
      $("#save").removeClass("btn-primary").addClass("btn-danger");
      $("#save").text("Login Failed!");
    }
  }
}

function getTagsResponse() {
  if (this.readyState == 4) {
    if (this.status == 0) {
      throw('Status = 0');
    } else if (this.status == 200) {
      var tags = []
      for (var i = 0, l = this.response.length; i < l; i++) {
        if (this.response[i].name != "") {
          tags.push(this.response[i].name);
        }
      }
      var storage = chrome.extension.getBackgroundPage().localStorage;
      storage.tags = tags
      $("#updatetags").removeClass("btn-primary").addClass("btn-success");
      $("#updatetags").text("Tags Cache Updated");
      return false;

    } else {
      $("#updatetags").removeClass("btn-primary").addClass("btn-danger");
      $("#updatetags").text("Tags Sync Failed!");
    }
  }
}

$(document).ready(function () {
  console.log("loaded");
  if (!isAuthAvailable()) {
    console.log("no token");
    $("#tags-cache").css("display","none");
  }
  var storage = chrome.extension.getBackgroundPage().localStorage;
  $("#username").val(storage.user);
  $("#server").val(storage.server);
  $("#cancel").click(function() {
    window.close();
    return false;
  });
  $("#save").click(function () {
    var storage = chrome.extension.getBackgroundPage().localStorage;
    var server = $("#server").val();
    storage.server = server;
    var user = $("#username").val();
    storage.user = user;
    var pass = $("#password").val();
    var params = JSON.stringify({ username: $("#username").val(), password: $("#password").val(),  });
    getToken(params, server, user, pass);
    return false;
  });
  $("#updatetags").click(function () {
    var params = JSON.stringify({});
    sendRequest("GET", params, "tags/", getTagsResponse);
    return false;
  });
});
