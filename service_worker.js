console.log("hello there, service_worker here");


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(sender)
  if (message.action === 'storeTimestamp') {
    console.log('Received message in background script:',sender);
    console.log(message.timestamp);
    console.log(message.noteInput);

    const currentTabUrl = sender.url;
    console.log("Content script url", currentTabUrl)

    chrome.storage.sync.get({videos:{}}, function (result){
      const videoData = result.videos[currentTabUrl] || {timestamps: []};
      videoData.timestamps.push({timestamp: message.timestamp, noteInput:message.noteInput});


      chrome.storage.sync.set({ videos: {...result.videos, [currentTabUrl]: videoData } }, function () {
      if (chrome.runtime.lastError) {
        console.error("Error saving timestamps:", chrome.runtime.lastError.message);
      } else {
        console.log("Timestamps saved to storage.");
      }
    });
  });
  } 
  else if (message.action === 'getStoredTimestamp') {
    return true;
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'getStoredTimestamp') {
    const currentTabUrl = message.currentTabUrl;
    console.log("Popup request url: ",currentTabUrl);

    chrome.storage.sync.get({ videos: {} }, function (result) {
      const videoData = result.videos[currentTabUrl] || { timestamps: [] };
      console.log("Values retrieved from the storage");
      console.log(result);
      console.log(videoData);
      // console.log("Timestamp value is " + result.timestamp);
      // console.log("NoteInput value is " + result.noteInput);
      if (videoData.timestamps.length > 0) {
        console.log("Correct data sent!!");
        sendResponse({ action: 'updateTimestamp', storedTimestamp: videoData.timestamps });
      } else {
        console.log('Nothing sent!');
        sendResponse({ action: 'No timestamps stored yet' });
      }
    });
    // Do not call sendResponse here; it should be called inside the chrome.storage.local.get callback
  }
  return true; // Indicates that the sendResponse callback will be called asynchronously
});