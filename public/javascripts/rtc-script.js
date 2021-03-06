//------Socket.io--------

const socket = io('/') //creating socket connection....connects socket at the root path of our server
//can i connect it only when I hit a certain path?
//gotta change this when I deploy


socket.emit('join-room', ROOM_ID, USER_NAME); //sends an event to our server, then server emits a 'user-connected' event, which we handle here
//10 should be mySDP





//debugee joins a room already opened
//display a button if the userID !== newly joined userID (only room owner can see it)
socket.on('user-connected', userId => { //server responds to us when some other user joins our room
    const connectBtn = document.createElement('button');
    const liveContainer = document.querySelector('.live-container');
    connectBtn.textContent = `Connect with ${userId}`
    connectBtn.classList.add('connect-btn');
    liveContainer.appendChild(connectBtn);

    connectBtn.addEventListener('click', function () {
        connectBtn.remove()

        invite();
    })
})


//----------Chat via socket------------------
const messageThreadEl = document.getElementById('message-thread');
const messageFormEl = document.getElementById('send-container');
const messageInputEl = document.getElementById('message-input');


messageFormEl.addEventListener('submit', e => {
    e.preventDefault(); //we do this to stop the page from refreshing...if it reloads the message could be wiped
    const message = messageInputEl.value;
    const sentMessageEl = document.createElement("p");
    sentMessageEl.textContent = message;
    sentMessageEl.classList.add('sent-msg');
    messageThreadEl.appendChild(sentMessageEl);
    
    socket.emit('sent-chat-message', message, ROOM_ID) //this sends out ('emits') an event containing 'message' data from our client back to our server 
    

    messageInputEl.value = '';
})




socket.on('chat-message', msg => {
    const newMessageEl = document.createElement("p");
    newMessageEl.textContent = msg;
    newMessageEl.classList.add('received-msg');
    messageThreadEl.appendChild(newMessageEl);
    console.log(msg);
})

//-------------------WebRTC---------------------


const mediaConstraints = {
    audio: {
        echoCancellation: true
    },
    video: true
}

//-----Debugger-------
let myPeerConnection = null;

function invite(event) {
    if (myPeerConnection) {
        console.log("a connection is already open");
        return;
    }

    createPeerConnection();

    navigator.mediaDevices.getDisplayMedia(mediaConstraints)
    .then(function(localStream) {
        //document.getElementById("local_video").srcObject = localStream; //uncomment if I wanna display local share
        localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream));
    })
    .catch(handleGetUserMediaError);
}

function createPeerConnection() {
    myPeerConnection = new RTCPeerConnection({
       iceServers: [
        {
            urls: 'stun:stun1.l.google.com:19302' 
        }
        //at a TURN server here as well to reach devices that are behind Symetric NAT...maybe make my own later
       ]
    });
    //assign my handlers to the connection events that I wanna listen for
    myPeerConnection.onicecandidate = handleICECandidateEvent;
    myPeerConnection.ontrack = handleTrackEvent; //navigator.mediaDevices promise chain in the invite func will trigger this event
    myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;

}

function handleICECandidateEvent(event) {
    if (event.candidate) { //the candidate prop on the event that onicecandidate sends us is the SDP of the candidate
        socket.emit('new-ice-candidate', event.candidate, ROOM_ID)
    }
}

function handleTrackEvent(event) {                                             //PROBLEM HERE! VAL OF el.srcObject is null??/
    document.getElementById("received_video").srcObject = event.streams[0];
    document.getElementById("hangup-button").disabled = false;
}

function handleNegotiationNeededEvent() {
    myPeerConnection.createOffer().then(function(offer) {
        return myPeerConnection.setLocalDescription(offer);
    })
    .then(function() {
        console.log(JSON.stringify(myPeerConnection.localDescription))
        socket.emit('video-offer', myPeerConnection.localDescription, ROOM_ID) //sending the local sdp to server
    })
    .catch(reportError);
} //once this is done, ICE candidates will be sent to server by the handleICECandidateEvent func

async function handleVideoAnswerMsg(sdp) {
    console.log("*** Call recipient has accepted our call");
  
    // Configure the remote description, which is the SDP payload
    // in our "video-answer" message.
  
    var desc = new RTCSessionDescription(sdp);
    await myPeerConnection.setRemoteDescription(desc).catch(reportError);
}

socket.on('answer-received', (sdp) => {
    handleVideoAnswerMsg(sdp);
})

//----------Debugee---------

//very similar to invite()
function handleVideoOffer(remoteSDP) {
    let localStream = null;

    createPeerConnection();

    const remoteDescription = new RTCSessionDescription(remoteSDP); //represents the Debuger's session description

    myPeerConnection.setRemoteDescription(remoteDescription).then(function() {
        // return navigator.mediaDevices.getUserMedia(mediaConstraints);   //DISPLAY MEDIA
        return navigator.mediaDevices.getDisplayMedia(mediaConstraints);
    })
    .then(function(stream) {
        localStream = stream;
        //document.getElementById('local_video').srcObject = localStream; //uncomment to see local

        localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream));
    })
    .then(function(answer) {
        return myPeerConnection.setLocalDescription(answer)
    })
    .then(function() {
        socket.emit('answer-to-offer', myPeerConnection.localDescription, ROOM_ID) //send answer sdp 
    })
    .catch(handleGetUserMediaError);
}

socket.on('received-video-offer', sdp => {
    handleVideoOffer(sdp);
})


function handleGetUserMediaError(e) {
    switch(e.name) {
      case "NotFoundError":
        alert("Unable to open your call because no camera and/or microphone" +
              "were found.");
        break;
      case "SecurityError":
      case "PermissionDeniedError":
        // Do nothing; this is the same as the user canceling the call.
        break;
      default:
        alert("Error opening your camera and/or microphone: " + e.message);
        break;
    }
  
    closeVideoCall();
}


function handleNewICECandidateMsg(remoteSDP) {
    var candidate = new RTCIceCandidate(remoteSDP); //value isn't right --> og input remoteSDP.candidate
  
    myPeerConnection.addIceCandidate(candidate)
      .catch(reportError);
}

socket.on('new-remote-ice-candidate', remoteSDP => {
    handleNewICECandidateMsg(remoteSDP)
})


function handleRemoveTrackEvent(event) {
    var stream = document.getElementById("received_video").srcObject;
    var trackList = stream.getTracks();
  
    if (trackList.length == 0) {
      closeVideoCall();
    }
}

function hangUpCall() {
    closeVideoCall();
    socket.emit('hang-up', ROOM_ID)
}

socket.on('hang-up', () => {
    closeVideoCall();
})

function closeVideoCall() {
    var remoteVideo = document.getElementById("received_video");
    //var localVideo = document.getElementById("local_video");
  
    if (myPeerConnection) {
      myPeerConnection.ontrack = null;
      myPeerConnection.onremovetrack = null;
      myPeerConnection.onremovestream = null;
      myPeerConnection.onicecandidate = null;
      myPeerConnection.oniceconnectionstatechange = null;
      myPeerConnection.onsignalingstatechange = null;
      myPeerConnection.onicegatheringstatechange = null;
      myPeerConnection.onnegotiationneeded = null;
  
      if (remoteVideo.srcObject) {
        remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      }
  
    //   if (localVideo.srcObject) {
    //     localVideo.srcObject.getTracks().forEach(track => track.stop());
    //   }
  
      myPeerConnection.close();
      myPeerConnection = null;
    }
  
    remoteVideo.removeAttribute("src");
    remoteVideo.removeAttribute("srcObject");
    //remoteVideo.  hide element
    //localVideo.removeAttribute("src");
    remoteVideo.removeAttribute("srcObject");
  
    document.getElementById("hangup-button").disabled = true;

}