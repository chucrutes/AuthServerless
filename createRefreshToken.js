const jwt = require('jsonwebtoken');
const {_, refreshToken} = require('./config');



module.exports = function createToken(id, role) {
    const token = jwt.sign(
        {
            user_id: id,
            user_role: role
        },
        refreshToken.secret,
        {
            expiresIn: refreshToken.expiresIn
        }
    )

    return token
}
