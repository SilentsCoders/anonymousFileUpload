// --- Select elements ---
const fileInput = document.getElementById("fileInput");
const textInput = document.getElementById("textInput");
const uploadBtn = document.getElementById("uploadBtn");
const link = document.getElementById("link");

// --- Event listener for button ---
uploadBtn.addEventListener("click", () => {
  const file = fileInput.files[0];
  const text = textInput.value.trim();

  if (!file && !text) {
    alert("Please upload a file or enter some text!");
    return;
  }

  let data;
  if (file) {
    // --- Convert file to Base64 string ---
    const reader = new FileReader();
    reader.onload = function (e) {
      const encoded = encodeURIComponent(e.target.result);
      const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
      link.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
    };
    reader.readAsDataURL(file);
  } else {
    // --- Encode text in URL ---
    const encoded = encodeURIComponent(text);
    const url = `${window.location.origin}${window.location.pathname}?text=${encoded}`;
    link.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
  }
});

// --- If someone opens a shared link ---
window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  const text = params.get("text");
  const data = params.get("data");

  if (text) {
    document.body.innerHTML = `<h2>Shared Text:</h2><pre>${decodeURIComponent(text)}</pre>`;
  } else if (data) {
    const a = document.createElement("a");
    a.href = decodeURIComponent(data);
    a.download = "shared_file";
    a.textContent = "Download Shared File";
    document.body.innerHTML = "";
    document.body.appendChild(a);
  }
});
