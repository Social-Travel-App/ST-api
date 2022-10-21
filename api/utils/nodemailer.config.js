const nodemailer = require('nodemailer')
const { OAuth2Client } = require('google-auth-library')

const GOOGLE_MAILER_CLIENT_ID = process.env.GOOGLE_MAILER_CLIENT_ID
const GOOGLE_MAILER_CLIENT_SECRET = process.env.GOOGLE_MAILER_CLIENT_SECRET
const GOOGLE_MAILER_REFRESH_TOKEN = process.env.GOOGLE_MAILER_REFRESH_TOKEN
const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS

const sendConfirmationEmail = async (email, confirmation_code) => {
  const myOAuth2Client = new OAuth2Client(
    GOOGLE_MAILER_CLIENT_ID,
    GOOGLE_MAILER_CLIENT_SECRET
  )

  myOAuth2Client.setCredentials({
    refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
  })
  const myAccessTokenObject = await myOAuth2Client.getAccessToken()
  const myAccessToken = myAccessTokenObject?.token
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: ADMIN_EMAIL_ADDRESS,
      clientId: GOOGLE_MAILER_CLIENT_ID,
      clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
      refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
      accessToken: myAccessToken,
    },
  })
  await transport
    .sendMail({
      form: ADMIN_EMAIL_ADDRESS,
      to: email,
      subject: 'Please confirm your account',
      html: `
        <h1>Email Confirmation Code</h1>
        <h2>Hello ${email}</h2>
        <p>Thank you for subscribing. Please confirm your email by enter confirmation code to verify</p>
        <p>your confirmation code is : ${confirmation_code}</p>
        </div>`,
    })
    .catch((err) => console.log(err))
}

module.exports = sendConfirmationEmail
