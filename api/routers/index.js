module.exports = function (app) {
  app.use("/auth", require("./auth.router"));
};
