// --- Select elements ---
const fileInput = document.getElementById("fileInput");
const textInput = document.getElementById("textInput");
const uploadBtn = document.getElementById("uploadBtn");
const link = document.getElementById("link");

// --- Event listener for upload button ---
uploadBtn.addEventListener("click", () => {
  const file = fileInput.files[0];
  const text = textInput.value.trim();

  if (!file && !text) {
    alert("Please upload a file or enter some text!");
    return;
  }

  if (file) {
    // --- Convert file to Base64 string ---
    const reader = new FileReader();
    reader.onload = function (e) {
      const encoded = encodeURIComponent(e.target.result);
      const fileName = encodeURIComponent(file.name);
      const url = `${window.location.origin}${window.location.pathname}?data=${encoded}&name=${fileName}`;
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

// --- When someone opens the shared link ---
window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  const text = params.get("text");
  const data = params.get("data");
  const name = params.get("name") ? decodeURIComponent(params.get("name")) : "shared_file";

  if (text) {
    // --- Display shared text ---
    document.body.innerHTML = `
      <h2>Shared Text:</h2>
      <pre style="white-space: pre-wrap; background:#f3f4f6; padding:10px; border-radius:8px;">${decodeURIComponent(text)}</pre>
    `;
  } else if (data) {
    // --- Create a real downloadable file from Base64 data ---
    const base64Data = decodeURIComponent(data);
    const byteString = atob(base64Data.split(',')[1]);
    const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeString });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.textContent = "⬇️ Download Shared File";
    a.style.display = "inline-block";
    a.style.background = "#2563eb";
    a.style.color = "white";
    a.style.padding = "10px 20px";
    a.style.borderRadius = "8px";
    a.style.textDecoration = "none";
    a.style.marginTop = "20px";

    document.body.innerHTML = "<h2>Your Shared File:</h2>";
    document.body.appendChild(a);
  }
});
