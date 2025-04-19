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
  
    fetch("https://your-backend.com/api/log-activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(res => console.log("Basic activity sent:", url));
  }
  
