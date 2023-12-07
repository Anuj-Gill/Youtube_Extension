console.log("hello there, service_worker here");


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'storeTimestamp') {
    console.log('Received message in background script:',sender);
    console.log(message.timestamp);
    console.log(message.noteInput);
    // Store the timestamp received from the content script
    chrome.storage.sync.set({ timestamp: message.timestamp, noteInput: message.noteInput }).then(() => {
      if (chrome.runtime.lastError) {
        console.error("Error saving timestamps:", chrome.runtime.lastError.message);
      } else {
        console.log("Timestamps saved to storage.");
      }
    });
  } 
  else if (message.action === 'getStoredTimestamp') {
    return true;
  }
});
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'getStoredTimestamp') {
    chrome.storage.sync.get(["timestamp", "noteInput"], function (result) {
      console.log("Values retrieved from the storage");
      console.log(result);
      console.log("Timestamp value is " + result.timestamp);
      console.log("NoteInput value is " + result.noteInput);
      if (result.timestamp && result.noteInput) {
        console.log("Correct data sent!!");
        sendResponse({ action: 'updateTimestamp', storedTimestamp: [result] });
      } else {
        console.log('Nothing sent!');
        sendResponse({ action: 'No timestamps stored yet' });
      }
    });
    // Do not call sendResponse here; it should be called inside the chrome.storage.local.get callback
  }
  return true; // Indicates that the sendResponse callback will be called asynchronously
});