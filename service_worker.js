console.log("hello there, service_worker here");

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(sender);
  if (message.action === "storeTimestamp") {
    console.log("Received message in background script:", sender);
    console.log(message.timestamp);
    console.log(message.timestamp);
    console.log(message.noteInput);

    const normalUrl = sender.url;
    let currentTabUrl = "";
    console.log(currentTabUrl);
    for (let i = 0; i < normalUrl.length; i++) {
      if (normalUrl[i] == "&") {
        break;
      } else {
        currentTabUrl += normalUrl[i];
      }
    }
    console.log("Content script url", currentTabUrl);

    //Calculating the time in seconds
    let tSecs = "";
    let lhs, rhs;
    let splittedArray = message.timestamp.split(":");
    if (splittedArray[0] != "00") {
      lhs = parseInt(splittedArray[0]);
      rhs = parseInt(splittedArray[1]);
      lhs = lhs * 60;
      tSecs = "&t=" + lhs + rhs + "s";
    } else {
      tSecs = "&t=" + splittedArray[1] + "s";
    }
    console.log(tSecs);

    chrome.storage.sync.get({ videos: {} }, function (result) {
      const videoData = result.videos[currentTabUrl] || { timestamps: [] };
      videoData.timestamps.push({
        timestamp: message.timestamp,
        noteInput: message.noteInput,
        tSecs: tSecs
      });

      chrome.storage.sync.set(
        { videos: { ...result.videos, [currentTabUrl]: videoData } },
        function () {
          if (chrome.runtime.lastError) {
            console.error(
              "Error saving timestamps:",
              chrome.runtime.lastError.message
            );
          } else {
            console.log("Timestamps saved to storage.");
          }
        }
      );
    });
  } else if (message.action === "getStoredTimestamp") {
    return true;
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "getStoredTimestamp") {
    const currentTabUrl = message.currentTabUrl;
    console.log("Popup request url: ", currentTabUrl);

    chrome.storage.sync.get({ videos: {} }, function (result) {
      const videoData = result.videos[currentTabUrl] || { timestamps: [] };
      console.log(
        "Values retrieved from the storage",
        result.videos[currentTabUrl]
      );
      console.log("Retrived video data", result);
      console.log("Retrived video data", videoData);
      console.log("Retrived video data", videoData["timestamps"]);
      // console.log("Timestamp value is " + result.timestamp);
      // console.log("NoteInput value is " + result.noteInput);
      if (videoData.timestamps.length > 0) {
        console.log("Correct data sent!!");
        sendResponse({
          action: "updateTimestamp",
          storedTimestamps: videoData["timestamps"],
        });
      } else {
        console.log("Nothing sent!");
        sendResponse({ action: "No timestamps stored yet" });
      }
    });
    // Do not call sendResponse here; it should be called inside the chrome.storage.local.get callback
  }
  return true; // Indicates that the sendResponse callback will be called asynchronously
});
