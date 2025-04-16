(() => {
  const site = location.hostname;
  const timestamp = new Date().toISOString();

  if (window.top !== window.self || location.href === 'about:blank') {
    console.log("Skipping execution in iframe or about:blank");
    return;
  }

  let category = null;

  if (site.includes("youtube.com")) {
    category = "streaming_youtube";

    let videoData = {
      durationMinutes: 0,
      dataUsedMb: 0,
      resolution: 'unknown'
    };

    const dataRates = {
      '3840x2160': 15.98,
      '2560x1440': 8.91,
      '1920x1080': 5.93,
      '1280x720': 2.97,
      'unknown': 3.0
    };

    function getVideoResolution(video) {
      return `${video.videoWidth}x${video.videoHeight}`;
    }

    function estimateDataUsage(resolution, durationMinutes) {
      const closest = Object.keys(dataRates).find(r => resolution.includes(r)) || 'unknown';
      return (dataRates[closest] * durationMinutes).toFixed(2);
    }

    function startTracking(video) {
      console.log("[CarbonCrumbs] Tracking video started.");

      let watchedSeconds = 0;

      setInterval(() => {
        if (!video.paused && !video.ended) {
          watchedSeconds += 5; // increment by interval

          const durationMinutes = (watchedSeconds / 60).toFixed(2);

          // Update resolution once at the start or if still unknown
          if (videoData.resolution === 'unknown' || watchedSeconds <= 10) {
            videoData.resolution = getVideoResolution(video);
          }

          videoData.durationMinutes = durationMinutes;
          videoData.dataUsedMb = estimateDataUsage(videoData.resolution, durationMinutes);

          chrome.runtime.sendMessage({
            type: 'youtubeStats',
            data: videoData
          });

          console.log("[CarbonCrumbs] Data sent:", videoData);
        }
      }, 5000); // update every 5 seconds
    }

    const observer = new MutationObserver(() => {
      const video = document.querySelector('video');
      if (video && !video.__carbonCrumbsTracked) {
        video.__carbonCrumbsTracked = true;
        startTracking(video);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const existingVideo = document.querySelector('video');
    if (existingVideo && !existingVideo.__carbonCrumbsTracked) {
      existingVideo.__carbonCrumbsTracked = true;
      startTracking(existingVideo);
    }

  } else if (
    site.includes("mail.google.com") ||
    site.includes("outlook.live.com")
  ) {
    category = "email";
  }

  let sessionStart = Date.now();

  window.addEventListener("beforeunload", () => {
    const duration = (Date.now() - sessionStart) / 1000;

    // fetch("", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     url: location.href,
    //     timestamp,
    //     duration,
    //     category
    //   })
    // });
  });
})();
