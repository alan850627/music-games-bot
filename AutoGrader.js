const YouTube = require('youtube-node');
const config = require('./config.json')

class AutoGrader {
  constructor() {
    this.youTube = new YouTube();
    this.youTube.setKey(config.youtube_token);
  }

  grade(correct_answer, challenge, callback) {
    this.youTube.search(correct_answer, 10, (error, correct_results_raw) => {
      if (error) throw error;
      let correct_arr = correct_results_raw.items.map((vid) => {
        return vid.id.videoId
      })

      this.youTube.search(challenge, 10, (error, challenge_results_raw) => {
        if (error) throw error;

        let challenge_arr = challenge_results_raw.items.map((vid) => {
          return vid.id.videoId
        })

        let common = this.compareTwoArraysIgnoreNull(correct_arr, challenge_arr);
        callback(common);
      })
    })
  }

  compareTwoArraysIgnoreNull(arr1, arr2) {
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i]) {
        for (let j = 0; j < arr2.length; j++) {
          if (arr2[j]) {
            if (arr1[i] === arr2[j]) {
              return true
            }
          }
        }
      }
    }
    return false
  }
}

module.exports = new AutoGrader();