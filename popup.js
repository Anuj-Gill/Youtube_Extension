// Display timestamps
function displayTimestamps(timestamps) {
  const timestampsList = document.querySelector('.timeStampsList');
  timestampsList.innerHTML = '';

  for (let i = 0; i < timestamps.length; i++) {
    const ts = timestamps[i];

    // Create elements
    const indexElement = document.createElement('p');
    indexElement.textContent = i + 1; // Use i + 1 to avoid displaying 1 for all entries
    indexElement.classList.add('index');

    const timestampElement = document.createElement('p');
    timestampElement.textContent = ts.timestamp;
    timestampElement.classList.add('timeStamp');

    const noteElement = document.createElement('p');
    noteElement.textContent = ts.noteInput;
    noteElement.classList.add('noteAdded');

    // Create container for each timestamp
    const timestampContainer = document.createElement('div');
    timestampContainer.appendChild(indexElement);
    timestampContainer.appendChild(timestampElement);
    timestampContainer.appendChild(noteElement);

    // Append container to timestamps list
    timestampsList.appendChild(timestampContainer);
  }
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

  // Check if the current tab is on a YouTube video page
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    console.log("Current tab: ",currentTab);
    const currentTabUrl = tabs[0].url;
    console.log(currentTabUrl)

    // Check if the URL is a YouTube video page using the isYouTubeVideoPage 
    if (isYouTubeVideoPage(currentTab.url)) {
      console.log("Entered youtube page");

      // If on a YouTube video page, proceed with the logic
      // - Attach event listener to handle form submission
      document.getElementById('markItForm').addEventListener('submit', function (event) {
        console.log("Form submitted");
        event.preventDefault(); // Prevent the default form submission behavior
        const noteInput = document.querySelector('#noteInput').value;
        console.log("Noteinput to be sent: ",noteInput);
        // Send a message to content script to request the timestamp
        chrome.tabs.sendMessage(currentTab.id, { action: 'requestTimestamp', noteInput: noteInput });
        console.log("Msg sent to contentScript!");

        // After submitting, display the updated timestamps
        chrome.runtime.sendMessage({ action: 'getStoredTimestamp',currentTabUrl: currentTabUrl }, function (response) {
          console.log("Msg received from background: ");
          console.log(response);

          if (response && response.action === 'updateTimestamp') {
            displayTimestamps(response.storedTimestamp);
          } else {
            console.log('Invalid response or no timestamps stored yet:', response);
          }
        });
      });

      // Display timestamps when the popup is opened
      chrome.runtime.sendMessage({ action: 'getStoredTimestamp' ,currentTabUrl: currentTabUrl}, function (response) {
        console.log("Msg received from background: ");
        console.log(response);

        if (response && response.action === 'updateTimestamp') {
          displayTimestamps(response.storedTimestamp);
        } else {
          console.log('Invalid response or no timestamps stored yet:', response);
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
      document.querySelector('.submit-button').style.visibility = "hidden";
      document.querySelector('h2').style.visibility = "hidden";
    }
  });

  // Function to check if the given URL is a YouTube video page
  function isYouTubeVideoPage(url) {
    return url.includes('youtube.com') && url.includes('/watch');
  }
});
