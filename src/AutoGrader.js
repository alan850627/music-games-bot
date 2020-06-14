const YouTube = require('youtube-node');
const config = require('../config.json');

class AutoGrader {
  constructor() {
    this.youTube = new YouTube();
    this.youTube.setKey(config.youtube_token);
  }

  grade(correct_answer, challenge, callback) {
    this.youTube.search(correct_answer, 10, (error, correct_results_raw) => {
      if (error) throw error;
      const correct_arr = correct_results_raw.items.map((vid) => vid.id.videoId);

      this.youTube.search(challenge, 10, (error2, challenge_results_raw) => {
        if (error2) throw error2;

        const challenge_arr = challenge_results_raw.items.map((vid) => vid.id.videoId);

        const common = this.compareTwoArraysIgnoreNull(correct_arr, challenge_arr);
        callback(common);
      });
    });
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

module.exports = new AutoGrader();
