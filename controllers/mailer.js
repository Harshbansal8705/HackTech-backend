const { createTransport } = require('nodemailer');

const transporter = createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_KEY,
    },
});

exports.sendMail = async(to, otp, signup=false) => {
    const mailOptions = {
        from: `HackTech <${process.env.MAIL_USER}>`,
        to: to,
        subject: `${signup ? "OTP for Registration" : "OTP for Login"}`,
        text: `Your OTP is ${otp}`,
    };
    
     transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log('Email sent: ' + info.response);
            return true;
        }
    });
    
}

