function readResponse() {
  if (this.readyState == 4) {
    console.log(this.status+' '+statusCodes[this.status]);
    if (this.status == 0) {
      throw('Status = 0');
    } else if (this.status == 200) {
      console.log(this.response.token);
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
      alert(this.status+' '+statusCodes[this.status]+'\n\nUse the extensions options to update your login details.');
      console.log(this.status+' '+statusCodes[this.status]);
      console.log(jQuery.trim(this.getAllResponseHeaders()));
      console.log(this.response);
      console.log(this);

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

