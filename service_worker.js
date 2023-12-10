console.log("hello there, service_worker here");

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(sender);
  if (message.action === "storeTimestamp") {
    console.log("Received message in background script:", sender);
    console.log(message.timestamp); // 00:06:17.split(":") = [00,06,17]
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
    let lhs, rhs, mhs;
    let splittedArray = message.timestamp.split(":");
    if (splittedArray.length <= 2) {
      if (splittedArray[0] != "00") {
        lhs = parseInt(splittedArray[0]);
        rhs = parseInt(splittedArray[1]);
        lhs = lhs * 60;
        tSecs = lhs + rhs;
        tSecs = "&t=" + tSecs + "s";
      } else {
        tSecs = "&t=" + splittedArray[1] + "s";
      }
    } else {
      if (splittedArray[0] != "00") {
        lhs = parseInt(splittedArray[0]);
        lhs = lhs * 60 * 60;
      } else {
        lhs = parseInt(splittedArray[0]);
      }
      if (splittedArray[1] != "00") {
        mhs = parseInt(splittedArray[1]);
        mhs = mhs * 60;
      } else {
        mhs = parseInt(splittedArray[1]);
      }
      rhs = parseInt(splittedArray[2]);
      tSecs = lhs + mhs + rhs;
      tSecs = "&t=" + tSecs + "s";
    }

    console.log(tSecs);

    chrome.storage.sync.get({ videos: {} }, function (result) {
      const videoData = result.videos[currentTabUrl] || { timestamps: [] };
      videoData.timestamps.push({
        timestamp: message.timestamp,
        noteInput: message.noteInput,
        tSecs: tSecs,
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
  } else if (message.action === "handleToggleClick") {
    console.log(message.currentTabUrl);
    const currentTabId = message.currentTabId;
    const normalUrl = message.currentTabUrl;
    let currentTabUrl = "";

    for (let i = 0; i < normalUrl.length; i++) {
      if (normalUrl[i] == "&") {
        break;
      } else {
        currentTabUrl += normalUrl[i];
      }
    }
    console.log(currentTabUrl);
    chrome.storage.sync.get({ videos: {} }, function (result) {
      console.log(result);
      const videoData = result.videos[currentTabUrl];
      console.log(videoData);
      const timeStampData = videoData["timestamps"];
      const data = timeStampData[message.index]["tSecs"];
      console.log(data);
      const finalUrl = currentTabUrl + data;
      console.log(finalUrl);

      chrome.tabs.sendMessage(currentTabId, {
        action: "toggleToTimestamp",
        finalUrl: finalUrl,
      });
    });
  }
  else if(message.action === "deleteTimestamp") {
    const currentTabUrl = message.currentTabUrl;
    const index = message.index;
    chrome.storage.sync.get({ videos: {} }, function (result) {
      console.log(result);
      const videoData = result.videos[currentTabUrl];
      console.log(videoData);
      let timeStampData = videoData["timestamps"];
      timeStampData.splice(index, 1);

      // Update the storage with the modified data
      chrome.storage.sync.set(
        { videos: { ...result.videos, [currentTabUrl]: { timestamps: timeStampData } } },
        function () {
          if (chrome.runtime.lastError) {
            console.error(
              "Error deleting timestamp:",
              chrome.runtime.lastError.message
            );
          } else {
            console.log("Timestamp deleted and storage updated.");
          }
        });
    });
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
