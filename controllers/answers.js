const Question = require('../models/question');

module.exports = {
    create,
}

async function create(req, res) {
    const question = await Question.findById(req.params.id);

    req.body.user = req.user._id;
    req.body.userName = req.user.name;
    req.body.userAvatar = req.user.avatar;
    
    question.replies.push(req.body);

    question.save((err) => {
        res.redirect(`/questions/${question._id}`)
    })
} 