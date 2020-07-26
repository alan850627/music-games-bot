const fetch = require('node-fetch');

const YOUTUBE_BASE_URL = 'https://www.youtube.com/results?search_query='
const REGEX_VIDEO_ID = /{"videoId":"([A-Za-z0-9_-]+)"}/g

class AutoGrader {
  static async youTubeSearch(query, len) {
  	const urlQuery = query.replace(/\ /g, '+');
  	const res = await fetch(YOUTUBE_BASE_URL + urlQuery)
  	const text = await res.text();

  	return [...text.matchAll(REGEX_VIDEO_ID)].map((match) => {
  	  return match[1]
  	}).slice(0, len)
  }

  static async asyncGrade(correctAnswer, challenge, callback) {
  	const correctArrPromise = AutoGrader.youTubeSearch(correctAnswer, 10)
  	const challengeArrPromise = AutoGrader.youTubeSearch(challenge, 10)
  	const res = await Promise.all([correctArrPromise, challengeArrPromise])

  	return AutoGrader.compareTwoArraysIgnoreNull(...res)
  }

  static grade(correctAnswer, challenge, callback) {
  	AutoGrader.asyncGrade(correctAnswer, challenge).then(res => {
  	  callback(res)
  	}).catch(err => {
  	  console.log(err)
  	})
  }

  static compareTwoArraysIgnoreNull(arr1, arr2) {
    for (let i = 0; i < arr1.length; i += 1) {
      if (arr1[i]) {
        for (let j = 0; j < arr2.length; j += 1) {
          if (arr2[j]) {
            if (arr1[i] === arr2[j]) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
}

module.exports = AutoGrader;
