const nodemailer = require('nodemailer');

const sendEmail = (options) => {
    // 1) Create a transporter
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Nodemailer Contact',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
    };

    // 3) Actually send the email
    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            return console.log(err);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
};

module.exports = sendEmail;
