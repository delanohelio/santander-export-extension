function sendMessage(sendResponse) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    lastTabId = tabs[0].id;
    chrome.tabs.sendMessage(lastTabId, "Starting", sendResponse);
  });
}

chrome.browserAction.onClicked.addListener(function(tab) {
  sendMessage(
    function (response) {
        if(response != "ok") {
            chrome.tabs.executeScript(tab.id, { file: "jquery.js" }, function(){
                chrome.tabs.executeScript(tab.id, { file: "FileSaver.js" }, function(){
                    chrome.tabs.executeScript(tab.id, {file: "content.js"}, function() {
                        sendMessage();
                    });
                });
            });
        }
    }
  );
});
