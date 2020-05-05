/**
 * Configuracion de Nodemailer
 */
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendingEmail = async (mailOptions) => {

    transporter.sendMail(mailOptions, function (err, info) {
        if (err)
            return err;
        else
            // console.log(info);
            return info;
    });
}

module.exports = {
    sendingEmail
}



