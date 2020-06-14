const mysql = require('mysql');
const Question = require('./Question.js');
const config = require('../config.json');

class Database {
  constructor() {
    this.connection = mysql.createConnection({
      host: config.my_sql.host,
      user: config.my_sql.username,
      password: config.my_sql.password,
      database: config.my_sql.database,
    });
    this.connection.connect();
  }

  getQuestionListFromUser(user_id, callback) {
    this.connection.query(`SELECT * FROM dt_questions WHERE user_id=${user_id}`,
      (error, results, fields) => { // eslint-disable-line no-unused-vars
        if (error) throw error;
        const ret = [];
        results.forEach((obj) => {
          ret.push(new Question(obj));
        });
        if (callback) callback(ret);
      });
  }

  getFirstQuestion(callback) {
    this.connection.query('SELECT * FROM dt_questions LIMIT 1',
      (error, results, fields) => { // eslint-disable-line no-unused-vars
        if (error) throw error;
        if (callback) {
          if (results[0]) callback(new Question(results[0]));
          else callback(null);
        }
      });
  }

  getQuestion(id, callback) {
    this.connection.query(`SELECT * FROM dt_questions WHERE question_id=${id}`,
      (error, results, fields) => { // eslint-disable-line no-unused-vars
        if (error) throw error;
        if (results[0]) callback(new Question(results[0]));
        else callback(null);
      });
  }

  deleteQuestion(id, callback) {
    this.connection.query(`DELETE FROM dt_questions WHERE question_id=${id}`,
      (error, results, fields) => { // eslint-disable-line no-unused-vars
        if (error) throw error;
        if (callback) callback();
      });
  }

  addQuestion(q, callback) {
    this.connection.query(`INSERT INTO dt_questions VALUES(
      '${this.mysql_real_escape_string(q.question_text)}',
      '${this.mysql_real_escape_string(q.url)}',
      '${this.mysql_real_escape_string(q.answer)}',
      '${q.user_id}',
      '${q.state}',
      NULL
    );`, (error, results, fields) => { // eslint-disable-line no-unused-vars
      if (error) throw error;
      if (callback) callback();
    });
  }

  static mysql_real_escape_string(str) {
    return str.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
      .replace(/[\0\x08\x09\x1a\n\r"'\\%]/g, (char) => { // eslint-disable-line no-control-regex
        switch (char) {
          case '\0':
            return '\\0';
          case '\x08':
            return '\\b';
          case '\x09':
            return '\\t';
          case '\x1a':
            return '\\z';
          case '\n':
            return '\\n';
          case '\r':
            return '\\r';
          case '"':
          case "'":
          case '\\':
          case '%':
            return `\\${char}`; // prepends a backslash to backslash, percent,
            // and double/single quotes
          default:
            return '';
        }
      });
  }
}

module.exports = new Database();
