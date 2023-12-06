let storedTimestamp = {};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('Received message in background script:', message);
  if (message.action === 'storeTimestamp') {
    // Store the timestamp received from the content script
    storedTimestamp = { timestamp: message.timestamp, noteInput: message.noteInput };
  } else if (message.action === 'getStoredTimestamp') {
    // Respond to the popup's request with the stored timestamp
    sendResponse({ action: 'updateTimestamp', timestamp: storedTimestamp.timestamp, noteInput: storedTimestamp.noteInput });
  }
});
