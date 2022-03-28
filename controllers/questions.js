const Question = require('../models/question');

module.exports = {
    index,
    create,
    show,
    delete: deleteQuestion,
    edit,
    update
}

function index(req, res) {
    Question.find({}, function(err, questions) {
        res.render('questions/index', { questions });
    })
}

function create(req, res) {
    req.body.user = req.user._id;
    req.body.userName = req.user.name;
    req.body.userAvatar = req.user.avatar;
    //req.body.isSolved = false;

    const question = new Question(req.body);


    question.save(function(err) {
        if (err) return res.redirect('/questions');
        console.log(question);
        res.redirect('/questions')
    })
}

function show(req, res) {
    console.log("hitting show controller function")
    Question.findById(req.params.id, function(err, question) {
        res.render('questions/show', { question })
    })
}

async function deleteQuestion(req, res) {
    try {
       const question = await Question.findById(req.params.id);
       await question.remove()

       res.redirect(`/questions`)
   } catch (error) {
       console.log(error)
   }
}

async function edit(req, res) {
    try {
        const question = await Question.findById(req.params.id);
        res.render('questions/update', { question })   
    } catch (error) {
        console.log(error)
    }
}

async function update(req, res) {
    try {
        const question = await Question.findById(req.params.id);
        question.title = req.body.title;
        question.content = req.body.content;
        question.isSolved = req.body.isSolved;

        await question.save(); //not sure if this works

        res.redirect(`/questions/${question._id}`)   
    } catch (error) {
        console.log(error)
    }
}