const mongoose = require('mongoose')
module.exports = async () => {
  await mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log('connected DB'))
    .catch((e) => console.log(e))
}
