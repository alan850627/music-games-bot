CREATE USER <user>@localhost IDENTIFIED BY <password>;
GRANT ALL PRIVILEGES ON * . * TO <user>@localhost;
CREATE DATABASE music_games;
USE music_games;
CREATE TABLE dt_questions
(
  question_text VARCHAR(500) NULL,
  url VARCHAR(200) NULL,
  answer VARCHAR(100) NOT NULL,
  user_id VARCHAR(30) NOT NULL,
  state TINYINT UNSIGNED NOT NULL,
  question_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY
);
