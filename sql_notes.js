CREATE USER <user>@localhost IDENTIFIED BY <password>;
GRANT ALL PRIVILEGES ON * . * TO <user>@localhost;
CREATE DATABASE music_games;
USE music_games;
CREATE TABLE questions
(
  question_text VARCHAR(500) NULL,
  url VARCHAR(200) NULL,
  answer VARCHAR(100) NOT NULL,
  user_id VARCHAR(30) NOT NULL,
  state TINYINT UNSIGNED NOT NULL,
  play_count INT UNSIGNED NOT NULL DEFAULT 0,
  played BIT NOT NULL DEFAULT 0,
  question_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY
);

// RESET ALL QUESTIONS
UPDATE questions SET played=0 WHERE question_id>"710";
DELETE FROM questions WHERE question_id>"710";

UPDATE questions SET played=0,play_count=0 WHERE question_id>"0";