const { expressjwt: jwt } = require("express-jwt");

const getTokenFromHeaders = function (req) {
  const { authorization } = req.headers;
  if (authorization && authorization.split(" ")[0] === "Bearer") {
    const token = authorization.split(" ")[1];
    req.token = token;
    return token;
  }
  return null;
};

const isRevokedCallbackAdmin = async function (req, token, done) {
  try {
    req.payload = token.payload;
    return token === "undefined" && !["admin"].includes(token.payload.role);
  } catch (error) {
    return done("has an error");
  }
};

const isRevokedCallbackUser = async function (req, token, done) {
  try {
    req.payload = token.payload;
    return token === "undefined";
  } catch (error) {
    return done("has an error");
  }
};

// 2 options algorithms HS256/RS256
const middlewareOptions = {
  user: jwt({
    secret: process.env.JWT_USER_SECRET,
    algorithms: ["HS256"],
    getToken: getTokenFromHeaders,
    isRevoked: isRevokedCallbackUser,
    userProperty: "payload",
  }),
  admin: jwt({
    secret: process.env.JWT_ADMIN_SECRET,
    algorithms: ["HS256"],
    getToken: getTokenFromHeaders,
    isRevoked: isRevokedCallbackAdmin,
    userProperty: "payload",
  }),
};

module.exports = middlewareOptions;
