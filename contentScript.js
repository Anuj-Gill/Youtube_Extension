chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'requestTimestamp') {
    // Extract timestamp from the YouTube page (adjust this part based on your logic)

    const currentTime = document.querySelector(".ytp-time-current").innerHTML;

    // Send the timestamp back to the popup
    chrome.runtime.sendMessage({ action: 'updateTimestamp', timestamp: currentTime });
  }
});



