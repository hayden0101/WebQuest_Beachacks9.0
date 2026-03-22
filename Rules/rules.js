const videoEl = document.getElementById("video");
const start = document.getElementById("start");
const canvas = document.getElementById("offscreen");

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: true,
    });
    videoEl.srcObject = stream;
    await videoEl.play();
    canvas.width = W;
    canvas.height = H;
    sending = true;
    sendFrameLoop();
    start.disabled = false;
  } catch (e) {
    start.disabled = true;
    console.error(e);
    alert(
      "We couldn't access your camera. Please allow camera permissions and try again.",
    );
  }
}
