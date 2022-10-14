const userModel = require("../schemas/User");
const { register } = require("../validations/auth");

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, confirmPassword } = req.body;
      await register.validateAsync({ email, password, confirmPassword });
      let user_model = new userModel(req.body);
      user_model.setPassword(password);

      return user_model
        .save()
        .then(() => res.status(200).send("register-success"))
        .catch(() => res.status(422).send("email-existed"));
    } catch (error) {
      return res.status(500).send(error);
    }
  }
}

module.exports = AuthController;
