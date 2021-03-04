const page = document.getElementById("button-container");
const colors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

for (const c of colors) {
  const colorButton = document.createElement("button");
  colorButton.style.backgroundColor = c;
  colorButton.addEventListener("click", () => {
    chrome.storage.sync.set({ color: c }, () => {
      console.log("color is " + c);
    });
  });

  page.appendChild(colorButton);
}
