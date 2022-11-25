const authToken = {
    secret: String(process.env.AUTH_TOKEN),
    expiresIn: '3600s'
}
const refreshToken = {
    secret: String(process.env.REFRESH_TOKEN),
    expiresIn: '3600'
}

module.exports = {authToken, refreshToken}