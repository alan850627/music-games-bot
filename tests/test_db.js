const Database = require('../src/Database.js');
const Question = require('../src/Question.js');

let o = {
  user_id: '12345',
  state: 3,
  question_text: 'question text test',
  url: 'https://www.google.com',
  answer: 'answer test'
}
let q = new Question(o);

// Database.addQuestion(q);

Database.getFirstQuestion((q) => {
  console.log(q);
});

