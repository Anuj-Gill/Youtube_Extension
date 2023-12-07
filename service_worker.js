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
    if (storedTimestamp.length > 0) {
      sendResponse({ action: 'updateTimestamp', timestamp: storedTimestamp[0].timestamp, noteInput: storedTimestamp[0].noteInput });
    } else {
      sendResponse({ action: 'updateTimestamp', timestamp: undefined, noteInput: undefined });
    }
  }
});
