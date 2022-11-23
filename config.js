const authToken = {
    secret: String(process.env.AUTH_TOKEN),
    expiresIn: '3600'
}

module.exports = {authToken}