const site = location.hostname;
const timestamp = new Date().toISOString();

let category = null;

if (site.includes("youtube.com")) category = "streaming_youtube";
else if (site.includes("netflix.com")) category = "streaming_netflix";
else if (site.includes("mail.google.com") || site.includes("outlook.live.com")) category = "email";
else if (site.includes("zoom.us")) category = "video_call";
else if (site.includes("drive.google.com") || site.includes("dropbox.com")) category = "cloud_storage";
else if (site.includes("chat.openai.com")) category = "ai_query";

let sessionStart = Date.now();

window.addEventListener("beforeunload", () => {
  const duration = (Date.now() - sessionStart) / 1000;

  fetch("https://your-backend.com/api/log-activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: location.href,
      timestamp,
      duration,
      category
    })
  });
});
