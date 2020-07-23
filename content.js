function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(async (msg, sender, sendResponse) => {
      if (msg.function == 'html') {
        try {
            var classLists = document.getElementsByClassName("name");
            classLists[Math.round(Math.floor(Math.random() * Math.floor(classLists.length)))].click()
          }
        catch(err) {
            console.log("Error: " + err + ".\nThe likely culpret is either running out from being on a non premium plan or a very unknown individual.");
        }
        port.postMessage({ iteration:"Completed iteration." });
      }
    });
  });