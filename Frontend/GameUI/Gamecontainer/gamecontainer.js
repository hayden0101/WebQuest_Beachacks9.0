import {
  startListening,
  calculateScore,
  filterMessage,
  validateWord,
} from "../../ai-integration/index.js";
const video = document.getElementById("video");

document.getElementById("listenBtn").addEventListener("click", () => {
  startListening();
});

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    video.srcObject = stream;
  } catch (e) {
    alert("Camera access needed");
  }
}
