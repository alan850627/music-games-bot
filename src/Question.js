const { Attachment } = require('discord.js');

const e_state = {
  INIT: 1,
  WAITING_FOR_QUESTION: 2,
  WAITING_FOR_ANSWER: 3,
  READY: 4,
  CONFIRMED: 5,
};

class Question {
  constructor(options = {}) {
    this.user_id = options.user_id || '';
    this.state = options.state || e_state.INIT;
    this.question_text = options.question_text || '';
    this.url = options.url || '';
    this.answer = options.answer || '';
    this.question_id = options.question_id || -1;
  }

  setQuestion(u, qt, qaurl) {
    if (this.state !== e_state.INIT
      && this.state !== e_state.WAITING_FOR_QUESTION) {
      return false;
    }
    this.user_id = u;
    this.question_text = qt;
    this.url = qaurl;

    this.state = e_state.WAITING_FOR_ANSWER;
    return this.state;
  }

  setAnswer(a) {
    if (this.state !== e_state.WAITING_FOR_ANSWER
      && this.state !== e_state.READY) {
      return false;
    }
    this.answer = a;
    this.state = e_state.READY;
    return this.state;
  }

  confirm() {
    if (this.state !== e_state.READY) {
      return false;
    }
    this.state = e_state.CONFIRMED;
    return this.state;
  }

  sendQuestion(m, withDetail) {
    let attachment;
    const { url } = this;
    if (url.length > 0) {
      attachment = new Attachment(url);
    }

    if (withDetail) {
      m.channel.send(`Submitted by <@${this.user_id}>: \n${this.question_text} (ID:${this.question_id}; Answer: _${this.answer})_`, attachment);
    } else {
      m.channel.send(`Submitted by <@${this.user_id}>: \n${this.question_text} (ID:${this.question_id})`, attachment);
    }
  }

  toJSON() {
    const tmp = {
      user_id: this.user_id,
      state: this.state,
      question_text: this.question_text,
      url: this.url,
      answer: this.answer,
    };

    return JSON.stringify(tmp, null, 2);
  }
}

module.exports = Question;
