// This js script is used to handle the form submission in the extension's popup window
// The popup script takes in user input (apiKey, appId, dataSource, db, and collection)
// when the user clicks the submit button. It checks if all required fields are filled and adds red border
// to empty input fields. If all required fields are filled, it sends the form data to the active tab
// and displays an acknowledgement message.

// Query for the active tab in the current window
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  // Get the first tab from the query result
  var currentTab = tabs[0];
  // Always reload the tab just in case the extension has been freshly installed or updated.
  chrome.tabs.reload(currentTab.id);
});

// Add a click event listener to the submit button
document.getElementById("submit-button").addEventListener("click", submitForm);
// Function to handles the click event on the form submit button
function submitForm(event) {
  event.preventDefault(); // prevent the form from submitting

  var inputs = document.querySelectorAll("input[required]"); // select all required input fields
  var valid = true;

  // Check if all required fields are filled
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].value === "") {
      valid = false;
      inputs[i].style.border = "1px solid red"; // add red border to empty input fields
    } else {
      inputs[i].style.border = ""; // remove red border from filled input fields
    }
  }

  if (!valid) {
    alert("Please fill out all the required fields"); // display error message
  } else {
    // Get the values of the form inputs
    var formData = {
      apiKey: document.getElementById("api-key").value,
      appId: document.getElementById("app-id").value,
      dataSource: document.getElementById("data-source").value,
      db: document.getElementById("db").value,
      collection: document.getElementById("collection").value
    };
    // Send the form data to the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "form_data", formData: formData }, function (response) {
        if (response && response.ack) {
          // Display an acknowledgement message
          var ackMessage = document.getElementById("ack-message");
          ackMessage.innerHTML = response.ack;
          ackMessage.style.display = "block";
        }
      });
    });
  }
}
