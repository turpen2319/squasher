const Question = require('../models/question');

module.exports = {
    index,
    create,
    show,
    delete: deleteQuestion,
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
   const question = await Question.findById(req.params.id);

   await question.remove()

   try {
       res.redirect(`/questions`)
   } catch (error) {
       console.log(error)
   }
}

// async function update(req, res) {
//     const question = await Question.findById(req.params.id);


// }