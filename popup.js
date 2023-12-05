// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

  // Check if the current tab is on a YouTube video page
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];

    // Check if the URL is a YouTube video page using the isYouTubeVideoPage 
    if(isYouTubeVideoPage(currentTab.url)){

      // If on a YouTube video page, proceed with the logic
      // - Attach event listeners to handle button click and form submission
      // - Implement the function to add timestamps and notes
      // - Implement the function to display existing timestamps
    }
    else {
      // If not on a YouTube video page, display a message or take appropriate action
      const heading = document.querySelector('h1');
      heading.innerHTML = 'Not a YouTube video';
      const hideForm = document.querySelector('#markItForm');
      hideForm.style.visibility = "hidden";
      const list = document.querySelector(".timeStampsList");
      list.style.visibility = "hidden";
      document.querySelector('body').style.height = "20px"
    }


  });

  // Function to check if the given URL is a YouTube video page
  function isYouTubeVideoPage(url) {
    // Add your logic to determine if the URL is a YouTube video page
    // For example, you can check if the URL contains "youtube.com" and "/watch"
    return url.includes('youtube.com') && url.includes('/watch');
  }


  function formSubmit(){

  }

  function addTimeStampandNote(){

  }

  function displayTimeStamp(){

  }

  function deleteTimeStamp(){
    
  }

  

});
