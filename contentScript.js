chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(`Request recieved from popup.js: Message: ${message}`);
  if (message.action === 'requestTimestamp') {
    // Extract timestamp from the YouTube page (adjust this part based on your logic)

    const currentTime = document.querySelector(".ytp-time-current").innerHTML;
    const noteInput  = message.noteInput;
    // Send the timestamp back to the popup
    console.log("Sending data to script_worker");
    chrome.runtime.sendMessage({ action: 'storeTimestamp', timestamp: currentTime, noteInput: noteInput });
  }
});



