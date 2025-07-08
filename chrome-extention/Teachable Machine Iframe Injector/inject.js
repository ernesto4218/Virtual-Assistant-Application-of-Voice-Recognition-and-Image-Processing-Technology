// inject.js running inside teachablemachine iframe

// Use MutationObserver to detect when #train is added
const observer = new MutationObserver((mutations, obs) => {
  const trainEl = document.getElementById('train');
  if (trainEl) {
    trainEl.style.display = 'none';  // hide the element
    console.log('Element #train hidden!');
    obs.disconnect(); // stop observing once done
  }
});

// Start observing the body for added nodes
observer.observe(document.body, { childList: true, subtree: true });
