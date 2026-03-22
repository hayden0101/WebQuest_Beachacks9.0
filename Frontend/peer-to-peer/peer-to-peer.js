// WebRTC Peer-to-Peer Video Chat
let localStream;
let peerConnection;
let remoteStream;
let localCandidates = [];
let gatheringTimeout;

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const answerButton = document.getElementById('answerButton');
const hangupButton = document.getElementById('hangupButton');
const createOfferButton = document.getElementById('createOfferButton');
const createAnswerButton = document.getElementById('createAnswerButton');
const connectButton = document.getElementById('connectButton');
const addCandidatesButton = document.getElementById('addCandidatesButton');
const copyCandidatesButton = document.getElementById('copyCandidatesButton');
const offerTextarea = document.getElementById('offerTextarea');
const remoteOfferTextarea = document.getElementById('remoteOfferTextarea');
const answerTextarea = document.getElementById('answerTextarea');
const remoteAnswerTextarea = document.getElementById('remoteAnswerTextarea');
const localCandidatesTextarea = document.getElementById('localCandidatesTextarea');
const remoteCandidatesTextarea = document.getElementById('remoteCandidatesTextarea');
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
  addCandidatesButton.addEventListener('click', addRemoteCandidates);
  copyCandidatesButton.addEventListener('click', copyCandidates);
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

  // Collect ICE candidates
  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      localCandidates.push(event.candidate);
      localCandidatesTextarea.value = JSON.stringify(localCandidates, null, 2);
      console.log('ICE candidate collected:', event.candidate);
    } else {
      console.log('ICE gathering complete');
      updateStatus('ICE candidates gathered. Share them with your peer.');
      // Enable the buttons when gathering is complete
      addCandidatesButton.disabled = false;
      copyCandidatesButton.disabled = false;
    }
  };

  // Handle connection state changes
  peerConnection.onconnectionstatechange = () => {
    console.log('Connection state:', peerConnection.connectionState);
    if (peerConnection.connectionState === 'connected') {
      hangupButton.disabled = false;
      updateStatus('Connected! Video chat is active.');
    }
  };
}

// Create offer (caller)
async function createOffer() {
  localCandidates = [];
  createPeerConnection();

  try {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    offerTextarea.value = JSON.stringify(offer);
    connectButton.disabled = false;
    addCandidatesButton.disabled = false;
    updateStatus('Offer created. Copy and send to your peer.');
  } catch (error) {
    console.error('Error creating offer:', error);
    updateStatus('Error creating offer.');
  }
}

// Create answer (receiver)
async function createAnswer() {
  localCandidates = [];
  createPeerConnection();

  try {
    const offer = JSON.parse(remoteOfferTextarea.value);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    answerTextarea.value = JSON.stringify(answer);
    addCandidatesButton.disabled = false;
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
    updateStatus('Answer set. Connecting...');
    
    // Give ICE time to complete gathering
    setTimeout(() => {
      updateStatus('Connection in progress. ICE candidates being processed...');
    }, 500);
  } catch (error) {
    console.error('Error connecting:', error);
    updateStatus('Error connecting. Check the answer format.');
  }
}

// Copy ICE candidates to clipboard
async function copyCandidates() {
  try {
    const candidatesText = localCandidatesTextarea.value;
    if (!candidatesText.trim()) {
      updateStatus('No candidates to copy. Please create an offer or answer first.');
      return;
    }
    
    await navigator.clipboard.writeText(candidatesText);
    updateStatus('ICE candidates copied to clipboard!');
    
    // Visual feedback
    const originalText = copyCandidatesButton.textContent;
    copyCandidatesButton.textContent = 'Copied!';
    setTimeout(() => {
      copyCandidatesButton.textContent = originalText;
    }, 2000);
    
  } catch (error) {
    console.error('Error copying candidates:', error);
    updateStatus('Failed to copy candidates. Please select and copy manually.');
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
  addCandidatesButton.disabled = true;
  copyCandidatesButton.disabled = true;

  offerTextarea.value = '';
  remoteOfferTextarea.value = '';
  answerTextarea.value = '';
  remoteAnswerTextarea.value = '';
  localCandidatesTextarea.value = '';
  remoteCandidatesTextarea.value = '';
  localCandidates = [];

  updateStatus('Call ended. Ready to start again.');
}

// Update status
function updateStatus(message) {
  statusElement.textContent = `Status: ${message}`;
}

// Initialize when page loads
init();