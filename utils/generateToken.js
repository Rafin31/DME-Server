const jwt = require('jsonwebtoken');

exports.generateToken = (userInfo) => {
    const payload = {
        userEmail: userInfo.email,
        userCategoryId: userInfo.categoryId,
        status: userInfo.status
    }
    const token = jwt.sign(payload, process.env.SECRET_TOKEN, {
        expiresIn: "30d"
    })
    return token;
}