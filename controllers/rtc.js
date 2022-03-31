const { v4: uuidV4 } = require('uuid'); //generates a unique url

module.exports = {
    index,
    createRoom,
    openRoom,
}

function index(req, res) {
    res.render('rtc/main')
}

function createRoom(req, res) {
    res.redirect(`/live/room/${uuidV4()}`)
}

function openRoom(req, res) {
    res.render('rtc/room', {roomId: req.params.roomId})
}