document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
      chrome.tabs.sendMessage(activeTab.id, { action: button.id });
    });
  });
});
