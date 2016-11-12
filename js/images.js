function isAuthAvailable() {
  return localStorage.username && localStorage.password;
}

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

var root = chrome.contextMenus.create({
  'id': 'snippet_image',
  'title': 'Snippet Image',
  'type': 'normal',
  'contexts': ['image']
});

var root = chrome.contextMenus.create({
  'id': 'snippet_imagelink',
  'title': 'Snippet Image',
  'type': 'normal',
  'contexts': ['link']
});

chrome.contextMenus.onClicked.addListener(function(menu, tab) {
  url = menu.srcUrl ? menu.srcUrl : menu.linkUrl;
  saveImage(url, tab);
});

saveImage = function(src, tab) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', src, true);

  xhr.responseType = 'arraybuffer';

  xhr.onload = function(e) {
    if (this.status == 200) {
      var uInt8Array = new Uint8Array(this.response);
      var i = uInt8Array.length;
      var biStr = new Array(i);
      while (i--) {
        biStr[i] = String.fromCharCode(uInt8Array[i]);
      }
      var data = biStr.join('');
      var base64 = window.btoa(data);
      var image64 = "data:image/png;base64," + base64;

      sendImage(image64, tab);
    }
  };

  xhr.send();
};

function sendImage(image64, tab) {
  var params = JSON.stringify({
    title: tab.title,
    url: tab.url,
    images: [{
      image: "file_name:" + slugify(tab.title) + "," + image64
    }]
  });
  console.log(params);
  sendRequest(params, "add/images/");
}

function readResponse() {
  if (this.readyState == 4) {
    console.log(this.status + ' ' + statusCodes[this.status]);
    if (this.status == 0) {
      throw ('Status = 0');
    } else if (this.status == 201) {
      var opt = {
        type: "basic",
        title: "Uploading Complete",
        message: "Saved as: " + this.response.images[0].image,
        iconUrl: 'icon/64.png'
      }
      chrome.notifications.create("", opt, function(Id) {
        setTimeout(chrome.notifications.clear, 5000, Id, function(cleared) {});
      });

    } else {
      var opt = {
        type: "basic",
        title: "Uploading Failed",
        message: JSON.stringify(this.response),
        iconUrl: 'icon/64sad.png'
      }
      chrome.notifications.create("", opt, function(Id) {
        setTimeout(chrome.notifications.clear, 5000, Id, function(cleared) {});
      });
    }

  }
}
