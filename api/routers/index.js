module.exports = function (app) {
  app.use('/client', require('./client/auth.router'))
}
