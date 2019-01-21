const mysql = require('mysql');
const Question = require('./Question.js');
const config = require('./config.json');


class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host     : config.my_sql.host,
      user     : config.my_sql.username,
      password : config.my_sql.password,
      database : config.my_sql.database
    });
    this.connection.connect();
  }

  getQuestionListFromUser(user_id, callback) {
    this.connection.query(`SELECT * FROM dt_questions WHERE user_id=${user_id}`,
    (error, results, fields) => {
      if (error) throw error;
      let ret = []
      results.forEach((obj) => {
        ret.push(new Question(obj));
      })
      if (callback) callback(ret);
    })
  }

  getFirstQuestion(callback) {
    this.connection.query(`SELECT * FROM dt_questions LIMIT 1`,
    (error, results, fields) => {
      if (error) throw error;
      if (callback) {
        if (results[0]) callback(new Question(results[0]));
        else callback(null);
      }
    })
  }

  getQuestion(id, callback) {
    this.connection.query(`SELECT * FROM dt_questions WHERE question_id=${id}`,
    (error, results, fields) => {
      if (error) throw error;
      if (results[0]) callback(new Question(results[0]));
      else callback(null);
    })
  }

  deleteQuestion(id, callback) {
    this.connection.query(`DELETE FROM dt_questions WHERE question_id=${id}`,
    (error, results, fields) => {
      if (error) throw error;
      if (callback) callback();
    });
  }

  addQuestion(q, callback) {
    this.connection.query(`INSERT INTO dt_questions VALUES(
      '${q.question_text.replace(/\'/g, '\'\'')}',
      '${q.url.replace(/\'/g, '\'\'')}',
      '${q.answer.replace(/\'/g, '\'\'')}',
      '${q.user_id.replace(/\'/g, '\'\'')}',
      '${q.state}',
      NULL
    );`, (error, results, fields) => {
      if (error) throw error;
      if (callback) callback();
    });
  }
}

module.exports = new Database();
