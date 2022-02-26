const mongoose = require('mongoose');       
//schemas

const detailschema = new mongoose.Schema({
    SNO: Number,
    StudentName: String,
    FatherName: String,
    CollegeName: String,
    Course: String,
    Branch: String,
    Section: String,
    FatherNumber: Number,
    StudentNumber: Number,
    Email: String
});
const questionsSchema = new mongoose.Schema({
    Question: {
        type: String,
        uppercase: true,

    },
    Answer: {
        type: String,
        uppercase: true,
    }
});
const StudentIdSchema = new mongoose.Schema({
    StudentID: String,
    StudentName: String,
    PrevSection: String,
    Performance: Number,
    CurSec: String
});
const adminSchema = new mongoose.Schema({
    AdminName: String,
    Password: String,
});
const questionsAskedSchema = new mongoose.Schema({
    query: String,
})

//models
const studentId = mongoose.model('studentids', StudentIdSchema);
const details = mongoose.model('details', detailschema);
const questions = mongoose.model('questions', questionsSchema);
const admin = mongoose.model('admin', adminSchema);
const questionsAsked = mongoose.model('questionsAsked', questionsAskedSchema);

module.exports = {
    details,
    questions,
    admin,
    questionsAsked,
    studentId
}
