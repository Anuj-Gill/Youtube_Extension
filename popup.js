// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

  // Check if the current tab is on a YouTube video page
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];

    // Check if the URL is a YouTube video page using the isYouTubeVideoPage 
    if (isYouTubeVideoPage(currentTab.url)) {

      // If on a YouTube video page, proceed with the logic
      // - Attach event listener to handle form submission
      document.getElementById('markItForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Send a message to content script to request the timestamp
        chrome.tabs.sendMessage(currentTab.id, { action: 'requestTimestamp' }, function(response) {
          // This function will be called once the content script responds
          if (response && response.action === 'updateTimestamp') {
            const timestamp = response.timestamp;
            // For example, update a span with the timestamp
            document.querySelector('.timeStamp').innerHTML = timestamp;
          }
        });
      });

      // - Implement the function to display existing timestamps
      chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.action === 'updateTimestamp') {
          const timestamp = message.timestamp;
          // For example, update a span with the timestamp
          document.querySelector('.timeStamp').innerHTML = timestamp;
        }
      });

    } else {
      // If not on a YouTube video page, display a message or take appropriate action
      const heading = document.querySelector('h1');
      heading.innerHTML = 'Not a YouTube video';
      const hideForm = document.querySelector('#markItForm');
      hideForm.style.visibility = "hidden";
      const list = document.querySelector(".timeStampsList");
      list.style.visibility = "hidden";
      document.querySelector('body').style.height = "20px";
    }
  });

  // Function to check if the given URL is a YouTube video page
  function isYouTubeVideoPage(url) {
    return url.includes('youtube.com') && url.includes('/watch');
  }

  function formSubmit() {
    // Implement form submission logic if needed
  }

  function addTimeStampandNote() {
    // Implement logic to add timestamps and notes
  }

  function displayTimeStamp() {
    // Implement logic to display existing timestamps
  }

  function deleteTimeStamp() {
    // Implement logic to delete timestamps
  }

});
