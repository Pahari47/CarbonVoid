chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    logBasicActivity(tab.url);
  }
});

function logBasicActivity(url) {
  const data = {
    url,
    timestamp: new Date().toISOString()
  };

  // fetch("", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data)
  // }).then(res => console.log("Basic activity sent:", url));
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'youtubeStats') {
    chrome.storage.local.set({ youtubeStats: message.data });

    // fetch("", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     timestamp: new Date().toISOString(),
    //     ...message.data,
    //     url: sender.tab?.url || 'unknown'
    //   })
    // });
  }
});
