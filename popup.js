// variables to represent items from html doc
var startButton = document.getElementById("startButton");
var consoleBox = document.getElementById("consoleBox")
var iterationValue = document.getElementById("iterationValue")
var clearConsole = document.getElementById("clearConsole")
sbActive = false;

function connect() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const port = chrome.tabs.connect(tabs[0].id);
    port.postMessage({ function: 'html' });
    port.onMessage.addListener((response) => {
      console.log(response.iteration)
    });
  });
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// async function iterateTimer(iterationValue){
//   startingValue = 0
//   while(startingValue < iterationValue && sbActive == true){
//     console.log("Hello");
//     await sleep(100);
//     startingValue += 1;
//   }
// }


function sbOffHandler(returnMessage){
  sbActive = false;
  consoleBox.value = consoleBox.value + "\n"+returnMessage;
  startButton.style.backgroundImage = 'url("inactive_face.jpg")';
}

function sbOnHandler(){
  sbActive = true;
  consoleBox.value = consoleBox.value + "\nStarting with " + iterationValue.value + " iterations.";
  startButton.style.backgroundImage = 'url("active_face.jpg")';
}

async function sbHandler(){
  if(sbActive){
    sbOffHandler("Stopping...");
  } else {
    if(iterationValue.value > 100 || iterationValue.value < 1){
      consoleBox.value = consoleBox.value + "\nMake sure the inputs are valid.";
    } else {
      sbOnHandler();
      for (i = 0; i < iterationValue.value; i++) {
        if(sbActive){
          chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var activeTab = tabs[0];
            chrome.tabs.executeScript(activeTab.id, { file: 'content.js'}, connect);
          });
          await sleep(Math.floor(Math.random() * Math.floor(500))+3500);
        }
      }
      sbOffHandler("Complete...");
    }
  }
  // Makes sure that the newest command is seen first.
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

function clearConsoleHandler(){
  consoleBox.value = "";
} 

document.addEventListener('DOMContentLoaded', function () {
  startButton.addEventListener('click', sbHandler);
  clearConsole.addEventListener("click", clearConsoleHandler);
});