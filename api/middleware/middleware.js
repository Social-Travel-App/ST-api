const { expressjwt: jwt } = require('express-jwt')

const getAccessTokenFromHeaders = function (req) {
  const { authorization } = req.headers
  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    const access_token = authorization.split(' ')[1]
    req.token = access_token
    return access_token
  }
  return null
}

const isRevokedCallbackUser = async function (req, token, done) {
  try {
    req.payload = token.payload

    return done(null)
  } catch (error) {
    return done('Has an error')
  }
}
const isRevokedCallbackPartner = async function (req, token, done) {
  try {
    req.payload = token.payload
    return done(null)
  } catch (error) {
    return done('Has an error')
  }
}
const isRevokedCallbackAdmin = async function (req, token, done) {
  req.payload = token.payload

  if (!['admin'].includes(payload.role)) {
    return done('Access denied')
  }
  return done(null)
}

// 2 options algorithms HS256/RS256
const middlewareOptions = {
  user: jwt({
    secret: process.env.JWT_USER_SECRET,
    algorithms: ['HS256'],
    getToken: getAccessTokenFromHeaders,
    isRevoked: isRevokedCallbackUser,
    userProperty: 'payload',
  }),
  partner: jwt({
    secret: process.env.JWT_PARTNER_SECRET,
    algorithms: ['HS256'],
    getToken: getAccessTokenFromHeaders,
    isRevoked: isRevokedCallbackPartner,
    userProperty: 'payload',
  }),
  admin: jwt({
    secret: process.env.JWT_ADMIN_SECRET,
    algorithms: ['HS256'],
    getToken: getAccessTokenFromHeaders,
    isRevoked: isRevokedCallbackAdmin,
    userProperty: 'payload',
  }),
}

module.exports = middlewareOptions
