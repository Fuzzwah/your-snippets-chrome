function loginResponse() {
  if (this.readyState == 4) {
    if (this.status == 0) {
      throw('Status = 0');
    } else if (this.status == 200) {
      var storage = chrome.extension.getBackgroundPage().localStorage;
      storage.token = this.response.token;
      $("#save").removeClass("btn-primary").addClass("btn-success");
      $("#save").text("Saved");
      setTimeout(function(){
        window.location = "popup.html";
      }, 500);
      return false;

    } else {
      $("#save").removeClass("btn-primary").addClass("btn-danger");
      $("#save").text("Login Failed!");
    }
  }
}

$(document).ready(function () {
  console.log("loaded");
  var storage = chrome.extension.getBackgroundPage().localStorage;
  $("#username").val(storage.user);
  $("#server").val(storage.server);
  $("#cancel").click(function() {
    window.close();
    return false;
  });
  $("#save").click(function () {
    var server = $("#server").val();
    var storage = chrome.extension.getBackgroundPage().localStorage;
    storage.server = server;
    var user = $("#username").val();
    storage.user = user;
    var pass = $("#password").val();
    var params = JSON.stringify({ username: $("#username").val(), password: $("#password").val(),  });
    getToken(params, server, user, pass);
    return false;
  });
});
