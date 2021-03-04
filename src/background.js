chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: "#3AA757" }, () => {
    console.log("The color is green.");
  });
});
