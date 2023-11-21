const nodeMailer = require('nodemailer');

const { 
    MAIL_SERVER, 
    MAIL_PORT,
    MAIL_USE_TLS,
    MAIL_USERNAME,
    MAIL_PASSWORD,
    MAIL_DEFAULT_SENDER
} = require('../../config');

function sendMailTo(to, subject, html) {
    const transporter = nodeMailer.createTransport({
        host: MAIL_SERVER,
        port: MAIL_PORT,
        secure: MAIL_USE_TLS,
        auth: {
            user: MAIL_USERNAME,
            pass: MAIL_PASSWORD
        }
    });

    var sent = false;
    const mailOptions = {
        from: MAIL_DEFAULT_SENDER,
        to,
        subject,
        html
    };

    return transporter.sendMail(mailOptions, 
        (err, info) => {
            if (err) {
                console.debug("Error: ", err);
            } else {
                console.debug("Email sent: ", info);
                sent = true;
            }
        }
    );
}

module.exports = sendMailTo;
