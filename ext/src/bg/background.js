// listen for our browerAction to be clicked
chrome.tabs.onUpdated.addListener(function(tab,change) {s
    if ( change.status === "complete" ){
        bkg.console.log("Loading Script");
        chrome.tabs.executeScript(tab.id, {file:'src/js/jquery-1.12.4.min.js'});
        chrome.tabs.executeScript(tab.id, {file:'src/js/inject.js'});
	}
});