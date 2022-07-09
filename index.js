//importing the required modules
const mongoose = require('mongoose');
const express = require("express");
const http = require('http');
const path = require("path");
const ai = require("clever-bot-api");
const google = require('google')
const {details, questions, admin, questionsAsked,studentId} = require('./models/schema');
const {db} = require('./database/db_connection');
const app = express();

//creating the server
const server = http.createServer(app);
app.use(express.urlencoded(true))

//mongoDb url
let URI = "mongodb+srv://deepank:passwordforbot@cluster0.wopim.mongodb.net/ChatBot?retryWrites=true&w=majority";

mongoose.connect(URI);
app.use(express.urlencoded(true))
app.use(express.static(__dirname + '/static/'));
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))


app.get('/', (req, res) => {
    res.render('index');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/details', (req, res) => {
    questionsAsked.find({}, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            if (data) {
                var result = Object.entries(data);
                console.log(result[1][1].query);
                res.render('details', {
                    ques: result
                });
            }
        }
    })
});

app.post('/addDetails', (req, res) => {
    var myData = new questions(req.body);
    myData.save().then(() => {
        res.status(200).render('addDetails');
    }).catch(() => {
        res.status(200).render('404');
    });
});

app.post('/', (req, res) => {
    let text = (req.body.query).toUpperCase();
    var questionAsk = new questionsAsked(req.body);
    questionAsk.save()
    console.log(text);
    studentId.findOne({
        StudentID: text
    }, function (err, data) {
        if (err) {
            console.log(err);

        } else {
            if (data) {
                let name = data.StudentName;
                console.log("Name is " + name);
                details.findOne({
                    StudentName: name
                }, function (err, data1) {
                    if (err) {} else {

                        console.log(data1);
                        res.render('index', {
                            data: data1.StudentName,
                            data1: data1.FatherName,
                            data2: data1.CollegeName,
                            data3: data1.Course,
                            data4: data1.Branch,
                            data5: data1.Section,
                            data6: data1.FatherNumber,
                            data7: data1.StudentNumber,
                            data8: data1.Email,
                            question: text
                        });
                    }
                });
            }
        }
    });
    questions.findOne({
        Question: {
            $regex : text,
            
            $options : 'i'
        }
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            if (data) {
                let question = data.Question;
                let answer = data.Answer;
                console.log("Question is " + question);
                console.log("Answer is " + answer);
                res.render('index', {
                    question: question,
                    answer: answer
                });

            }
        }
    });
    ai(text).then(data => google(text, function (err, link) {
        if (err) console.error(err);
        console.log(link.url);

        res.render('index', {
            data: data,
            link: link.url,
            question: text
        });
    })).catch(err => console.error(err));

})
app.post('/login', (req, res) => {
    let username = (req.body.username).toUpperCase();
    let password = (req.body.password).toUpperCase();
    console.log(username);
    console.log(password);
    admin.findOne({
        AdminName: username,
        Password: password
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            if (data) {
                res.status(200).render('addDetails'); 
            } else {
                console.log(err);
                res.status(200).render('login');
            }
        }
    });
})

const PORT = process.env.PORT || 9000;
     
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));