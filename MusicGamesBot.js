const { Client, Attachment } = require('discord.js');
const client = new Client();
const config = require('./config.json');
const Arena = require('./Arena.js')
const QuestionMan = require('./QuestionMan')

client.on('ready', () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
});


client.on('message', async message => {

  if(message.author.bot) return;

  // check if it's a command for us!
  const str = message.content;
  if(str.indexOf(config.prefix) !== 0) return;

  let s = str.indexOf(' ');
  let command = '', arg = '';
  if(s === -1) {
    command = str.toLowerCase();
    arg = '';
  } else {
    arg = str.substr(s+1);
    command = str.substr(0,s).toLowerCase();
  }

  if (command.startsWith('.b')) {
    // buzz
    Arena.submitGradeRequest(message, message.author.id, arg);
  } else if(command.startsWith('.q')) {
    // submit a question
    let att = message.attachments.array()[0];
    let url = '';
    if (att) {
      url = att.url;
    }
    QuestionMan.submitQuestion(message, message.author.id, message.author.username, arg, url);
  } else if (command.startsWith('.a')) {
    // submit an answer
    QuestionMan.submitAnswer(message, message.author.id, arg);
  } else if (command.startsWith('.s')) {
    // skip
    Arena.submitSkipRequest(message, message.author.id);
  } else if (command.startsWith('.r')) {
    // repeat
    Arena.repeatQuestion(message);
  } else if (command.startsWith('.p')) {
    // play
    Arena.play(message);
  } else if (command.startsWith('.h')) {
    // help
  } else if (command.startsWith('.y')) {
    // yes
    QuestionMan.confirm(message, message.author.id);
  } else if (command.startsWith('.c')) {
    // cancel
    QuestionMan.cancel(message, message.author.id);
  } else if (command.startsWith('.d')) {
    // delete question
    let qid = parseInt(arg);
    if (!qid) {
      message.channel.send('Invalid question ID.');
      return;
    }
    QuestionMan.deleteQuestion(message, message.author.id, qid);
  } else if (command.startsWith('.l')) {
    // list questions
    QuestionMan.listQuestions(message, message.author.id);
  }
});

client.login(config.discord_token);