const emailRegex =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// have at least one number and one letter, min 8, max 34
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,34}$/

module.exports = {
  emailRegex,
  passwordRegex,
}
