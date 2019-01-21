
Database = require('./Database.js');
Question = require('./Question.js');

class QuestionMan {
  constructor() {
    this.unconfirmed = {}
  }

  submitQuestion(m, user_id, user_name, question_text, attachment) {
    if (this.unconfirmed[user_id]) {
      m.channel.send('Use `.cancel` to resubmit the question.');
      return;
    }
    let q = new Question();
    if (!q.setQuestion(user_id, user_name, question_text, attachment)) {
      m.channel.send('Use `.cancel` to resubmit the question.');
      return;
    }
    this.unconfirmed[user_id] = q;
    m.channel.send('Success. Use `.answer` to submit the correct answer to the question.');
  }

  submitAnswer(m, user_id, a) {
    if (!this.unconfirmed[user_id]) {
      m.channel.send('You must submit a question first before submitting an answer to that question. To submit a question, use `.question` or `.q`.');
      return;
    }
    if (!this.unconfirmed[user_id].setAnswer(a)) {
      m.channel.send('Submit Answer Error! Please try again.');
      return;
    }
    m.channel.send('Please review your submission. Type `.yes` to confirm, type `.cancel` to cancel.');
    this.unconfirmed[user_id].sendQuestion(m, true);
  }

  confirm(m, user_id) {
    if (!this.unconfirmed[user_id]) {
      m.channel.send('You must submit a question first. To submit a question, use `.question` or `.q`.');
      return;
    }

    if (!this.unconfirmed[user_id].confirm()) {
      m.channel.send('You must submit a question and an answer to that question before confirming. Use `.question` to submit a question and use `.answer` to submit an answer');
      return;
    }

    Database.addQuestion(this.unconfirmed[user_id], () => {
      delete this.unconfirmed[user_id];
    });
    m.channel.send('Your question has been added.');
  }

  cancel(m, user_id) {
    if (!this.unconfirmed[user_id]) {
      m.channel.send('There is nothing for you to cancel.');
      return;
    }
    delete this.unconfirmed[user_id];
    m.channel.send('Your question has been canceled.');
  }

  deleteQuestion(m, user_id, question_id) {
    Database.getQuestion(question_id, (q) => {
      if (!q) {
        m.channel.send(`There's no question with ID ${question_id}`);
        return;
      }

      if (q.user_id !== user_id) {
        m.channel.send(`Question with ID ${question_id} is not created by you. You cannot delete it.`);
        return;
      }

      Database.deleteQuestion(question_id, () => {
        m.channel.send(`Question with ID ${question_id} successfully deleted.`);
      })
    });
  }

  listQuestions(m, user_id) {
    Database.getQuestionListFromUser(user_id, (arr) => {
      m.channel.send(`You have ${arr.length} question(s) waiting to be played.`);
      arr.forEach(q => {
        q.sendQuestion(m, true);
      })
    })
  }
}

module.exports = new QuestionMan();