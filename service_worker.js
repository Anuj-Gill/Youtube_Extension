console.log("hello there, service_worker here");
let storedTimestamp = [];

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'storeTimestamp') {
    console.log('Received message in background script:',sender);
    console.log(message.timestamp);
    // Store the timestamp received from the content script
    storedTimestamp.push({ timestamp: message.timestamp, noteInput: message.noteInput });
    console.log(storedTimestamp);
  } else if (message.action === 'getStoredTimestamp') {
    // Respond to the popup's request with the stored timestamp
    if (storedTimestamp.length != 0) {
      console.log("Sending correct thing");
      sendResponse({ action: 'updateTimestamp', storedTimestamp});
    } else {
      console.log("sending undefined");
      sendResponse({ action: 'Have some patience', storedTimestamp});
    }
  }
});
