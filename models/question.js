const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const replySchema = new Schema({
    content: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'}, //referencing user
    userName: String,
    userAvatar: String,
    isBestAnswer: {
        type: Boolean,
        default: () => false
    }
}, {
    timestamps: true
});

const questionSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'}, //referencing user
    userName: String,
    userAvatar: String,
    isSolved: {
        type: Boolean,
        default: () => false
    },
    replies: [replySchema] //embedding replies

}, {
    timestamps: true
});


module.exports = mongoose.model('Question', questionSchema);