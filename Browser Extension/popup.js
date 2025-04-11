document.getElementById("open-dashboard").addEventListener("click", () => {
    chrome.tabs.create({ url: "https://your-dashboard.com" });
  });
  