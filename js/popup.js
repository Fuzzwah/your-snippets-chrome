function addSnippetResponse() {
  if (this.readyState == 4) {
    try {
      if (this.status == 0) {
        throw('Status = 0');
      } else if (this.status == 201) {
        $("#save").removeClass("btn-primary").addClass("btn-success");
        $("#save").text("Saved");
        setTimeout(function(){
          window.close();
        }, 500);
      } else if (this.response.url[0]=="snippet with this url already exists.") {
        $("#save").removeClass("btn-primary").addClass("btn-warn");
        $("#save").text("Previously Saved");
      } else {
        $("#save").removeClass("btn-primary").addClass("btn-danger");
        $("#save").text("Save Failed!");
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
    var publicItem = true
    $("#public").change(function() {
      if(this.checked) {
        publicItem = true
      } else if(!this.checked) {
        publicItem = false
      }
    });
    new Awesomplete('input[data-multiple]', {
      list: localStorage.tags,
      filter: function(text, input) {
        return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
      },

      replace: function(text) {
        var before = this.input.value.match(/^.+,\s*|/)[0];
        this.input.value = before + text + ", ";
      }
    });
    chrome.tabs.getSelected(null, function(tab) {
      $("#url").val(tab.url);
      $("#title").val(tab.title);
    });
    $("#save").click(function() {
      var tagField = $("#tags").val().trim();
      if (tagField.endsWith(",")) {
        tagField = tagField.slice(0, -1);
      }
      var tagFieldComp = tagField.split(", ").join(",");
      var theseTags = tagFieldComp.split(",");
      var savedTagsString = localStorage.tags;
      var savedTagsStringComp = savedTagsString.split(", ").join(",");
      var savedTags = savedTagsString.split(",");
      for (var i = 0, l = theseTags.length; i < l; i++) {
        var thisTag = theseTags[i].trim()
        if (thisTag != "") {
          if ( $.inArray(thisTag, savedTags) === -1 ) {
            localStorage.tags = localStorage.tags + "," + thisTag;
          } else {
          }
        }
      }
      var params = JSON.stringify({ title: $("#title").val(), url: $("#url").val(), public: publicItem, content: $("#content").val(), tags: theseTags.join(", "), images: [] });
      sendRequest("POST", params, "add/", addSnippetResponse);
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
