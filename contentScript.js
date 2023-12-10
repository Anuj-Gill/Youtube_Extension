console.log("hello there, i am contentScript");

const normalUrl = window.location.href;
let currentTabUrl = "";
console.log(currentTabUrl);
for (let i = 0; i < normalUrl.length; i++) {
  if (normalUrl[i] == "&") {
    break;
  } else {
    currentTabUrl += normalUrl[i];
  }
}

chrome.runtime.sendMessage({ action: "storeCurrentTabUrl", currentTabUrl });

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(`Request recieved from popup.js: Message: ${message}`);
  if (message.action === "requestTimestamp") {
    // Extract timestamp from the YouTube page (adjust this part based on your logic)

    const currentTime = document.querySelector(".ytp-time-current").innerHTML;
    const noteInput = message.noteInput;
    // Send the timestamp back to the popup
    console.log("Sending data to script_worker", currentTime, noteInput);
    chrome.runtime.sendMessage({
      action: "storeTimestamp",
      timestamp: currentTime,
      noteInput: noteInput,
    });
  } else if (message.action === "anotherAction") {
    // Handle another action
    console.log("Not working!!");
  }
  else if(message.action === "toggleToTimestamp") {
    console.log(message.finalUrl);

    const finalUrl = message.finalUrl;

    // Update the URL
    window.location.href = finalUrl;
    console.log(window.location.href)

    // Optionally, you might want to refresh the page after updating the URL
    // This will ensure that the content script is re-injected and runs again
    // window.location.reload(true);
  }
});
