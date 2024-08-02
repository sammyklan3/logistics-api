const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter object
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

/**
 * Send an email with Nodemailer
 * @param {string} to - Recipient's email address
 * @param {string} subject - Subject line of the email
 * @param {string} text - Plain text body of the email
 * @param {string} html - HTML body of the email
 */
const sendEmail = (to, subject, text, html) => {
    // Set up email data
    let mailOptions = {
        from: `"Nova Core" ${process.env.MAIL_USER}`, // Sender address
        to: to, // Recipient address
        subject: subject, // Subject line
        text: text, // Plain text body
        html: html // HTML body
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
};

module.exports = sendEmail;