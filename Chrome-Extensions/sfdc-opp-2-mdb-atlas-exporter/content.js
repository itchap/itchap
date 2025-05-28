// The content.js script listens for a message sent by the popup with form data,
// checks if the current page is a Salesforce Opportunity View, extracts the table data
// and sends it to the background script along with the config data and a warning
// if more than one table is found. It also sends an acknowledgement message to the popup
// with the number of documents processed and a note to check the Atlas cluster to ensure
// the data is stored correctly. If the current page is not a Salesforce Opportunity View,
// it sends a message to the background script with the config data and type "no_data"
// and sends an acknowledgement message to the popup that the script won't run on this page.

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // Check if the current page is a Salesforce Opportunity View
  if (window.location.href.indexOf("my.salesforce.com") > -1) {
    if (request.type === "form_data") {
      var tableData = [];
      var tables = document.getElementsByTagName("table");
      var tabWarning = "";
      // check if more than one table found
      if (tables.length > 1) {
        tabWarning = "More than one table found";
      }
      // Only use the first table found
      var table = tables[0];
      // remove unnecessary table elements
      table.outerHTML = table.outerHTML.replace(
        /<\/?(tbody|thead|tfoot|colgroup|col|caption)[^>]*>/g,
        ""
      );
      var thElements = table.getElementsByTagName("th");
      // replace th elements with td elements
      while (thElements.length > 0) {
        var th = thElements[0];
        var td = document.createElement("td");
        td.innerHTML = th.innerHTML;
        th.parentNode.replaceChild(td, th);
      }
      var rows = table.getElementsByTagName("tr");
      for (var j = 0; j < rows.length; j++) {
        var rowData = [];
        var cells = rows[j].getElementsByTagName("td");
        for (var k = 0; k < cells.length; k++) {
          if (j == 0 && cells[k].innerText == "Opportunity ID (18)") {
            cells[k].innerText = "_id";
          }
          rowData.push(cells[k].innerText);
        }
        tableData.push(rowData);
      }
      // Send the extracted data to the background script
      chrome.runtime.sendMessage({
        type: "all_data",
        configData: request.formData,
        oppData: tableData,
        warning: tabWarning
      });
      // Get the number of documents processed
      let docCount = rows.length - 1;
      // Send the acknowledgement message to the popup
      sendResponse({
        ack:
          "Config data submitted successfully! " +
          docCount +
          " documents processed.<br>Check out your Atlas cluster to ensure the data is stored as expected."
      });
    }
  } else {
    // Send a message to the background script with the configData and type "no_data" if the current page is not a Salesforce Opportunity View
    chrome.runtime.sendMessage({ type: "no_data", configData: request.formData });
    // Send the acknowledgement message to the popup
    sendResponse({ ack: "This is not a Salesforce Opportunity View (in 'Print' mode), so the script won't run." });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "update") {
        location.reload();
    }
});
