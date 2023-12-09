// Display timestamps
function displayTimestamps(timestamps) {
  const timestampsList = document.querySelector('.timeStampsList');
  timestampsList.innerHTML = '';
  console.log(timestamps);

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

    // const deleteButton = document.createElement('button');
    // deleteButton.innerHTML = `<svg viewBox="0 0 448 512" class="svgIcon"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>`;
    // deleteButton.classList.add('button')

    // Create container for each timestamp
    const timestampContainer = document.createElement('div');
    timestampContainer.appendChild(indexElement);
    timestampContainer.appendChild(timestampElement);
    timestampContainer.appendChild(noteElement);
    // timestampContainer.appendChild(deleteButton);

    timestampsList.appendChild(timestampContainer);



  }
}

//function for delete functionallity 
// function deleteItem(x, url) {
//   chrome.runtime.sendMessage({action: 'deleteTimestamp', index: x, url : url});
  
// }

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

  // Check if the current tab is on a YouTube video page
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    console.log("Current tab: ",currentTab);
    const normalUrl = tabs[0].url; 
    let currentTabUrl = "";
    console.log(currentTabUrl);
    for(let i = 0; i < normalUrl.length; i++) {
      if(normalUrl[i] == "&"){
        break;
      }
      else{
        currentTabUrl += normalUrl[i];
      }
    }
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
            console.log("calling display function!!");
            displayTimestamps(response["storedTimestamps"]);
          } else {
            console.log('Invalid response or no timestamps stored yet:', response);
          }
        });
      });

      // Display timestamps when the popup is opened
      chrome.runtime.sendMessage({ action: 'getStoredTimestamp' ,currentTabUrl: currentTabUrl}, function (response) {
        console.log("Msg received from background: ");
        console.log(response["storedTimestamps"]);

        if (response && response.action === 'updateTimestamp') {
          console.log("calling display function!!");
          displayTimestamps(response["storedTimestamps"]);
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
