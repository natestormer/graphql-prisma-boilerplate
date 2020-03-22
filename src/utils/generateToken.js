import jwt from "jsonwebtoken"

const AUTH_SECRET = process.env.AUTH_SECRET
const TOKEN_EXPIRATION = "7 days"

const generateToken = userId =>
  jwt.sign({ userId }, AUTH_SECRET, {
    expiresIn: TOKEN_EXPIRATION,
  })

export { generateToken as default }
