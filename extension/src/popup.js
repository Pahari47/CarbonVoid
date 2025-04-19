import * as clerk from "@clerk/chrome-extension";

document.addEventListener("DOMContentLoaded", async () => {
  const emailDiv = document.getElementById("userEmail");

  try {
    const user = await clerk.user;

    if (user) {
      emailDiv.textContent = `Logged in as: ${user.primaryEmailAddress.emailAddress}`;
    } else {
      emailDiv.textContent = "Please log in";
    }
  } catch (error) {
    console.error("Clerk error:", error);
    emailDiv.textContent = "Authentication error";
  }

  document.getElementById("open-dashboard").addEventListener("click", () => {
    chrome.tabs.create({ url: "http://localhost:5173" });
  });

  chrome.storage.local.get(['youtubeStats'], (result) => {
    if (result.youtubeStats) {
      document.getElementById('youtube-stats').style.display = 'block';
      document.getElementById('duration').textContent = result.youtubeStats.durationMinutes;
      document.getElementById('data-used').textContent = result.youtubeStats.dataUsedMb;
      document.getElementById('resolution').textContent = result.youtubeStats.resolution;
    }
  });
});
