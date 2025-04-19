document.addEventListener("DOMContentLoaded", async () => {
  const loginForm = document.getElementById("loginForm");
  const mainContent = document.getElementById("mainContent");
  const authForm = document.getElementById("authForm");
  const authError = document.getElementById("authError");
  const emailDiv = document.getElementById("userEmail");
  const logoutButton = document.getElementById("logout");

  // Check if user is already logged in
  chrome.storage.local.get(['authToken', 'userEmail'], (result) => {
    if (result.authToken && result.userEmail) {
      showMainContent(result.userEmail);
    }
  });

  // Handle login form submission
  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth token and email
        chrome.storage.local.set({
          authToken: data.token,
          userEmail: email
        }, () => {
          showMainContent(email);
        });
      } else {
        authError.textContent = data.error || "Login failed";
      }
    } catch (error) {
      authError.textContent = "Connection error. Please try again.";
      console.error("Login error:", error);
    }
  });

  // Handle logout
  logoutButton.addEventListener("click", () => {
    chrome.storage.local.remove(['authToken', 'userEmail'], () => {
      loginForm.style.display = "block";
      mainContent.style.display = "none";
      authForm.reset();
      authError.textContent = "";
    });
  });

  // Open dashboard button
  document.getElementById("open-dashboard").addEventListener("click", () => {
    chrome.tabs.create({ url: "http://localhost:5173" });
  });

  // Show YouTube stats if available
  chrome.storage.local.get(['youtubeStats'], (result) => {
    if (result.youtubeStats) {
      document.getElementById('youtube-stats').style.display = 'block';
      document.getElementById('duration').textContent = result.youtubeStats.durationMinutes;
      document.getElementById('data-used').textContent = result.youtubeStats.dataUsedMb;
      document.getElementById('resolution').textContent = result.youtubeStats.resolution;
    }
  });

  function showMainContent(email) {
    loginForm.style.display = "none";
    mainContent.style.display = "block";
    emailDiv.textContent = `Logged in as: ${email}`;
  }
});