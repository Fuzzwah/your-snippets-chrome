function readResponse() {
  if (this.readyState == 4) {
    try {
      console.log(this.status+' '+statusCodes[this.status]);
      if (this.status == 0) {
        throw('Status = 0');
      } else if (this.status == 201) {
        $("#save").removeClass("btn-primary").addClass("btn-success");
        $("#save").text("Saved");
        setTimeout(function(){
          window.close();
        }, 500);
      } else {
        $("#save").removeClass("btn-primary").addClass("btn-danger");
        $("#save").text("Save Failed!");
        alert(this.status+' '+statusCodes[this.status]+'\n\nUpdate your login details in this extensions options');
        console.log(this.status+' '+statusCodes[this.status]);
        console.log(jQuery.trim(this.getAllResponseHeaders()));
        console.log(this.response);
        console.log(this);

      }
    }
    catch(e) {
      console.log("No response.");
    }
  }
}

function isAuthAvailable(){
  return localStorage.token && localStorage.server;
}

if (!isAuthAvailable()) {
  window.location = "login-popup.html";
} else {

  $(document).ready(function() {
    chrome.tabs.getSelected(null, function(tab) {
      $("#url").val(tab.url);
      $("#title").val(tab.title);
    });
    $("#save").click(function() {
      var params = JSON.stringify({ title: $("#title").val(), url: $("#url").val(), content: $("#content").val(), tags: $("#tags").val(), images: [] });
      console.log(params);
      sendRequest(params, "add/");
      return false;
    });
    $("#cancel").click(function() {
      window.close();
      return false;
    });
  });

  chrome.tabs.executeScript( {
    code: "window.getSelection().toString();"
    }, function(selection) {
      $("#content").val(selection);
  });

}
