const Database = require('../src/Database.js');
const Question = require('../src/Question.js');
const fs = require('fs');

const rawdata = fs.readFileSync('music-games-export.json');
const questions = JSON.parse(rawdata).questions;
const q = questions['-KuHBbaLT6Di-TnaJ7ie']

Object.values(questions).forEach(q => {
  if (q.isAudio) {
    return
  }
  let o = {
    question_text: q.description,
    url: q.link,
    answer: q.solution,
    user_id: q.op,
    state: 5
  }

  console.log(o)

  let qObj = new Question(o);

  Database.addQuestion(qObj, () => {});
})


Database.connection.end()