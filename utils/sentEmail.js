const nodemailer = require('nodemailer');


exports.sendMail = (emailBody, emailAddress) => {

    var message = {
        from: process.env.SENT_EMAIL,
        to: emailAddress,
        ...emailBody
    };


    nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENT_EMAIL,
            pass: process.env.SENT_EMAIL_PASSWORD,
        },
        port: 465,
        host: 'smtp.gmail.com'
    }).sendMail(message, (err) => {
        if (err) {
            return new Error(err)
        } else {
            return "Email Sent"
        }
    })

}