const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {

    const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
        expiresIn: "7d"
    })

    return token;
}