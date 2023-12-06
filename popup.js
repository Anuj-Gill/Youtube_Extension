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
        const noteInput = document.querySelector('#noteInput').value;
        
        // Send a message to content script to request the timestamp
        chrome.runtime.sendMessage({ action: 'requestTimestamp', noteInput: noteInput });

      // - Implement the function to display existing timestamps
      chrome.runtime.sendMessage({ action: 'getStoredTimestamp' }, function (response) {
        if (response && response.action === 'updateTimestamp') {
          const timestamp = response.timestamp;
          const noteInput = response.noteInput;
          document.querySelector('.timeStamp').innerHTML = timestamp;
          document.querySelector('.noteAdded').innerHTML = noteInput;
        }
      });
      });
    }
    
     else {
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

});
