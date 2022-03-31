const $showQuestionKebab = $('#show-question-kebab');
const $kebabMenuItems = $('.kebab-menu-items')


$showQuestionKebab.click(function() {
    
    $kebabMenuItems.toggleClass("show-menu")
});



//------Socket.io--------

const socket = io('/') //creating socket connection....connects socket at the root path of our server
//can i connect it only when I hit a certain path?
//gotta change this when I deploy

socket.emit('join-room', ROOM_ID, 10); //sends an event to our server
//10 should be mySDP


socket.on('user-connected', userId => {
    console.log('user connected ' + userId); //another user's SDP should replace userId
})

