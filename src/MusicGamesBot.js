const { Client } = require('discord.js');

const client = new Client();
const config = require('../config.json');
const Arena = require('./Arena.js');
const QuestionMan = require('./QuestionMan');

client.on('ready', () => {
  // eslint-disable-next-line no-console
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
});

client.on('message', async (message) => {
  if (message.author.bot) return;

  // check if it's a command for us!
  const str = message.content;
  if (str.indexOf(config.prefix) !== 0) return;

  const s = str.indexOf(' ');
  let command = '';
  let arg = '';
  if (s === -1) {
    command = str.toLowerCase();
    arg = '';
  } else {
    arg = str.substr(s + 1);
    command = str.substr(0, s).toLowerCase();
  }

  if (command.startsWith(`${config.prefix}b`)) {
    // buzz
    Arena.submitGradeRequest(message, message.author.id, arg);
  } else if (command.startsWith(`${config.prefix}q`)) {
    // submit a question
    const att = message.attachments.array()[0];
    let url = '';
    if (att) {
      url = att.url;
    }
    QuestionMan.submitQuestion(message, message.author.id, arg, url);
  } else if (command.startsWith(`${config.prefix}a`)) {
    // submit an answer
    QuestionMan.submitAnswer(message, message.author.id, arg);
  } else if (command.startsWith(`${config.prefix}s`)) {
    // skip
    Arena.submitSkipRequest(message, message.author.id);
  } else if (command.startsWith(`${config.prefix}r`)) {
    // repeat
    Arena.repeatQuestion(message);
  } else if (command.startsWith(`${config.prefix}p`)) {
    // play
    Arena.play(message);
  } else if (command.startsWith(`${config.prefix}h`)) {
    // help
    message.channel.send(`Hello I'm AlanBot. If you have questions about me, contact @Alanolen.
----GENERAL COMMANDS----
\`${config.prefix}help\`: display this text.
\`${config.prefix}info\`: display tips and info.
\`${config.prefix}play\`: start a round of games. Will do nothing if a round of games has already started.
\`${config.prefix}repeat\`: repeats a question.
\`${config.prefix}buzz [answer]\`: buzz to answer a question with whatever text following the command as your final answer.
\`${config.prefix}skip\`: skip the current question. Requires at least ${config.skip_threshold} votes to skip. There is a ${config.skip_timeout / 1000} second timeout before you can vote again. 

--SUBMITTING QUESTIONS--
Note: You want to run these commands in the AlanBot DM.
\`${config.prefix}question [question text]\`: submit a question. You may also attach an image or a file as part of your question.
\`${config.prefix}answer [the correct answer]\`: after you submit a question by using the \`question\` command, you'll be prompted to enter the correct answer. This correct answer will be used by the autograder, so please ensure whatever text you enter here is compatible. Read below for details about how the autograder works.
\`${config.prefix}yes\`: after you submit an answer, you'll be prompted to confirm your submission. 
\`${config.prefix}cancel\`: you can cancel your submission if you find a mistake after you submit an answer to your question.
\`${config.prefix}list\`: list the questions you've submitted.
\`${config.prefix}delete [question id]\`: delete the question specified by the ID. You can only delete questions you submitted.
`);
  } else if (command.startsWith(`${config.prefix}i`)) {
    message.channel.send(`---------RULES----------
There are ${config.questions_per_game} questions per game. Type \`${config.prefix}buzz [your answer]\` to answer a question. The person with the fastest correct response will get 10 points. Getting an answer wrong will cost you 5 points. Have fun!

--------DETAILS---------
So you want to know how this works? Well first, a tip for you: for faster buzzing, use \`${config.prefix}b [your answer]\` instead of typing \`buzz\`. In fact, I purposely chose commands that have different starting letters so you can trigger them with just one letter alone. The questions submitted are played in order, and are deleted once played. The auto-grader makes use of YouTube search. First, I search YouTube for 10 videos with the correct answer, then I do the same with the buzzed answer. If the intersection between the two sets is non-empty, then the buzzed answer is correct. In simpler terms, if there was at least one common video between the two sets of 10 videos, then I mark the buzzed answer as correct. You can find the source code here: <https://github.com/alan850627/music-games-bot>.`);
  } else if (command.startsWith(`${config.prefix}y`)) {
    // yes
    QuestionMan.confirm(message, message.author.id);
  } else if (command.startsWith(`${config.prefix}c`)) {
    // cancel
    QuestionMan.cancel(message, message.author.id);
  } else if (command.startsWith(`${config.prefix}d`)) {
    // delete question
    QuestionMan.deleteQuestion(message, message.author.id, parseInt(arg, 10));
  } else if (command.startsWith(`${config.prefix}l`)) {
    // list questions
    QuestionMan.listQuestions(message, message.author.id);
  }
});

client.login(config.discord_token);
