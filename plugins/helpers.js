const milliSeconds = 1000;

class Helpers {
  static getTimeWithoutMilliSeconds() {
    return Math.round(new Date().getTime() / milliSeconds);
  }
}

module.exports = Helpers