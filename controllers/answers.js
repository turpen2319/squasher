const Question = require('../models/question');

module.exports = {
    create,
    update
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

async function update(req, res) {
    const question = await Question.findById(req.params.questionId);
    
    let bestAnswers = 0;
    for (let answer of question.replies) {
        if (answer.id === req.params.answerId && answer.isBestAnswer === true) { //try using answer._id.equals() instead of using just plain .id
            answer.isBestAnswer = false;
        } else if (answer.id === req.params.answerId && answer.isBestAnswer === false) {
            answer.isBestAnswer = true;
        }

        if (answer.isBestAnswer === true) bestAnswers +=1;
    }

    if (bestAnswers) {
        question.isSolved = true;
    } else {
        question.isSolved = false;
    }

    await question.save()
    
    res.redirect(`/questions/${question._id}`);
}