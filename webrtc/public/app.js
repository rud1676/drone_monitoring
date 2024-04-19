const socket = io();

const call = document.getElementById("call");

let roomName;
let myDataChannel;

const my = document.getElementById("my");
let myStream;
let myPeerConnection;

async function init() {
  await getCameras();
  makeConnection();
  socket.emit("welcome");
}

function makeConnection() {
  myPeerConnection = new RTCPeerConnection();
  console.log("create Connection");
  myPeerConnection.addEventListener("icecandidate", (data) => {
    console.log("Sent Ice Candidate");
    socket.emit("ice", data.candidate);
  });
  myPeerConnection.addEventListener("track", (data) => {
    const peer = document.querySelector("#peer");
    peer.srcObject = data.streams[0];
  });
  myStream.getTracks().forEach((track) => {
    myPeerConnection.addTrack(track, myStream);
  });
}

async function getCameras() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({ video: true });
    my.srcObject = myStream;
  } catch (e) {
    console.log(e);
  }
}

// socket Code
socket.on("hi", async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  socket.emit("offer", offer);
});

socket.on("offer", async (offer) => {
  console.log("get Offer", offer);
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer(offer);
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer);
});

socket.on("answer", (answer) => {
  console.log("get answer");
  myPeerConnection.setRemoteDescription(answer);
});
socket.on("ice", (ice) => {
  console.log("Added Ice Candidates");
  myPeerConnection.addIceCandidate(ice);
});

init();
