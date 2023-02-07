const jwt = require('jsonwebtoken');
const {authToken, _} = require('./config');

module.exports = function createToken(id, role) {
    const token = jwt.sign(
        {
            user_id: id,
            user_role: role
        },
        authToken.secret,
        {
            expiresIn: authToken.expiresIn
        }
    )
    return token
}
