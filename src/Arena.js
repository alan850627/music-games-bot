const Database = require('./Database.js');
const AutoGrader = require('./AutoGrader.js');
const config = require('../config.json');

const e_game_status = {
  WAITING: 0,
  STARTED: 1,
};

class Arena {
  constructor() {
    this.leaderboard = {};
    this.question_count = 0;
    this.current_question = null;
    this.grading_queue = [];
    this.skip_obj = {};
    this.skip_counter = 0;
    this.grading = false;
    this.game_status = e_game_status.WAITING;

    this.autograder_timer = null;
  }

  grade() {
    if (this.grading || !this.current_question) {
      return;
    }

    const ent = this.grading_queue.shift();
    if (!ent) {
      return;
    }
    this.grading = true;
    AutoGrader.grade(this.current_question.answer, ent.challenge, (res) => {
      let score = 0;
      if (this.leaderboard[ent.user_id]) {
        score = this.leaderboard[ent.user_id];
      }

      if (res) {
        ent.message.channel.send(`<@${ent.user_id}> +10`);
        score += 10;
      } else {
        ent.message.channel.send(`<@${ent.user_id}> -5`);
        score -= 5;
      }
      this.leaderboard[ent.user_id] = score;

      if (res) {
        this.nextQuestion(ent.message);
      }
      this.grading = false;
    });
  }

  submitGradeRequest(m, user_id, challenge) {
    if (this.game_status !== e_game_status.STARTED) {
      m.channel.send('Game not started. No buzzing allowed.');
      return;
    }
    if (this.current_question.user_id === user_id) {
      m.channel.send('You cannot buzz your own question.');
      m.channel.send(`<@${user_id}> -5`);
      this.leaderboard[user_id] -= 5;
      return;
    }
    this.grading_queue.push({
      message: m,
      user_id,
      challenge,
    });
  }

  submitSkipRequest(m, user_id) {
    if (this.game_status !== e_game_status.STARTED) {
      m.channel.send('Game not started. What are you even trying to do?');
      return;
    }
    if (this.skip_obj[user_id]) {
      // if it has not been over a minute
      if (Date.now() - this.skip_obj[user_id] <= config.skip_timeout) {
        m.channel.send('You have already tried to skip this question. Wait a while and you can submit another skip request.');
        return;
      }
    }
    this.skip_obj[user_id] = Date.now();
    this.skip_counter += 1;

    if (this.skip_counter < config.skip_threshold) {
      m.channel.send(`${this.skip_counter}/${config.skip_threshold} votes to skip this question.`);
      return;
    }

    // Skip the question.
    m.channel.send('Question skipped.');
    this.nextQuestion(m);
  }

  gameOver(m) {
    m.channel.send('Game over.');
    m.channel.send(this.leaderboardToString());

    // Reset arena
    clearInterval(this.autograder_timer);
    this.leaderboard = {};
    this.question_count = 0;
    this.current_question = null;
    this.grading_queue = [];
    this.skip_obj = {};
    this.skip_counter = 0;
    this.grading = false;
    this.game_status = e_game_status.WAITING;
    m.channel.send('Type `.play` to start another game.');
  }

  leaderboardToString() {
    let l_string = '-----leaderboard-----\n';
    Object.keys(this.leaderboard)
      .sort((a, b) => this.leaderboard[b] - this.leaderboard[a])
      .forEach((user_id) => {
        l_string += `<@${user_id}>: ${this.leaderboard[user_id]} points.\n`;
      });
    l_string += '------------------------';
    return l_string;
  }

  play(m) {
    if (this.game_status !== e_game_status.WAITING) {
      this.repeatQuestion(m);
      return;
    }
    this.game_status = e_game_status.STARTED;
    this.autograder_timer = setInterval(() => {
      this.grade();
    }, 1000);
    m.channel.send(`Welcome to Alan's Music Games. There will be ${config.questions_per_game} questions per game. Type \`${config.prefix}buzz [your answer]\` to answer a question. The person with the fastest correct response will get 10 points. Getting an answer wrong will cost you 5 points. Have fun!`);
    this.nextQuestion(m);
  }

  nextQuestion(m) {
    if (this.question_count >= config.questions_per_game) {
      this.gameOver(m);
      return;
    }
    this.skip_counter = 0;
    this.skip_obj = {};
    this.grading_queue = [];

    this.getNewQuestion(m);
  }

  getNewQuestion(m) {
    Database.getFirstQuestion((q) => {
      this.current_question = q;
      if (this.current_question) {
        this.question_count += 1;
        Database.deleteQuestion(q.question_id);
      }
      this.sendQuestion(m);
    });
  }

  repeatQuestion(m) {
    if (this.game_status !== e_game_status.STARTED) {
      m.channel.send('Game not started! What are you doing?');
      return;
    }
    if (!this.current_question) {
      this.getNewQuestion(m);
    } else {
      this.sendQuestion(m);
    }
  }

  sendQuestion(m) {
    if (!this.current_question) {
      // no more questions
      m.channel.send('There are no questions left. DM me to submit one!');
      return;
    }
    m.channel.send(`---- Question ${this.question_count} of ${config.questions_per_game} ----`);
    this.current_question.sendQuestion(m, false);
  }
}

module.exports = new Arena();
