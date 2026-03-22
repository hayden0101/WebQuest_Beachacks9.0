// WebRTC Peer-to-Peer Video Chat
let localStream;
let peerConnection;
let remoteStream;

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const answerButton = document.getElementById('answerButton');
const hangupButton = document.getElementById('hangupButton');
const createOfferButton = document.getElementById('createOfferButton');
const createAnswerButton = document.getElementById('createAnswerButton');
const connectButton = document.getElementById('connectButton');
const offerTextarea = document.getElementById('offerTextarea');
const remoteOfferTextarea = document.getElementById('remoteOfferTextarea');
const answerTextarea = document.getElementById('answerTextarea');
const remoteAnswerTextarea = document.getElementById('remoteAnswerTextarea');
const statusElement = document.getElementById('status');

// STUN servers for NAT traversal
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

// Initialize
function init() {
  startButton.addEventListener('click', startCamera);
  callButton.addEventListener('click', createOffer);
  answerButton.addEventListener('click', createAnswer);
  hangupButton.addEventListener('click', hangup);
  createOfferButton.addEventListener('click', createOffer);
  createAnswerButton.addEventListener('click', createAnswer);
  connectButton.addEventListener('click', connect);
}

// Start camera
async function startCamera() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    localVideo.srcObject = localStream;
    startButton.disabled = true;
    callButton.disabled = false;
    answerButton.disabled = false;
    createOfferButton.disabled = false;
    createAnswerButton.disabled = false;
    updateStatus('Camera started. Ready to connect.');
  } catch (error) {
    console.error('Error accessing camera:', error);
    updateStatus('Error accessing camera. Please check permissions.');
  }
}

// Create peer connection
function createPeerConnection() {
  peerConnection = new RTCPeerConnection(configuration);

  // Add local stream
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  // Handle remote stream
  peerConnection.ontrack = event => {
    remoteStream = event.streams[0];
    remoteVideo.srcObject = remoteStream;
    updateStatus('Connected! You can see each other\'s video.');
  };

  // Handle ICE candidates
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      // In a real app, you'd send this to the signaling server
      console.log('ICE candidate:', event.candidate);
    }
  };

  // Handle connection state changes
  peerConnection.onconnectionstatechange = () => {
    console.log('Connection state:', peerConnection.connectionState);
    if (peerConnection.connectionState === 'connected') {
      hangupButton.disabled = false;
    }
  };
}

// Create offer (caller)
async function createOffer() {
  createPeerConnection();

  try {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    offerTextarea.value = JSON.stringify(offer);
    updateStatus('Offer created. Copy and send to your peer.');
  } catch (error) {
    console.error('Error creating offer:', error);
    updateStatus('Error creating offer.');
  }
}

// Create answer (receiver)
async function createAnswer() {
  createPeerConnection();

  try {
    const offer = JSON.parse(remoteOfferTextarea.value);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    answerTextarea.value = JSON.stringify(answer);
    connectButton.disabled = false;
    updateStatus('Answer created. Copy and send back to your peer.');
  } catch (error) {
    console.error('Error creating answer:', error);
    updateStatus('Error creating answer. Check the offer format.');
  }
}

// Connect (caller receives answer)
async function connect() {
  try {
    const answer = JSON.parse(remoteAnswerTextarea.value);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    updateStatus('Connecting...');
  } catch (error) {
    console.error('Error connecting:', error);
    updateStatus('Error connecting. Check the answer format.');
  }
}

// Hang up
function hangup() {
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }

  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
  }

  localVideo.srcObject = null;
  remoteVideo.srcObject = null;

  startButton.disabled = false;
  callButton.disabled = true;
  answerButton.disabled = true;
  hangupButton.disabled = true;
  createOfferButton.disabled = true;
  createAnswerButton.disabled = true;
  connectButton.disabled = true;

  offerTextarea.value = '';
  remoteOfferTextarea.value = '';
  answerTextarea.value = '';
  remoteAnswerTextarea.value = '';

  updateStatus('Call ended. Ready to start again.');
}

// Update status
function updateStatus(message) {
  statusElement.textContent = `Status: ${message}`;
}

// Initialize when page loads
init();