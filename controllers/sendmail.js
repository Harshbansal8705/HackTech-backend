const { boolean } = require("webidl-conversions");
const { client } = require("../redis");
const { sendMail } = require("./mailer")
const speakeasy = require('speakeasy');

exports.SendMail = async(req ,res ) =>{
    console.log(req.body);
    try {
        const secret = speakeasy.generateSecret({ length: 20 });
        console.log(secret);

        // Generate OTP
        const otp = speakeasy.totp({
            secret: secret.base32,
            encoding: "base32"
        });
        
        // save the secret key in the user object or database
        if (!client.isOpen) return res.status(500).json({ success: false, message: "Redis client error" , code : -4  });
        await client.set(req.body.email,  secret.base32, { EX: process.env.OTP_EXPIRE_TIME }, (err, res) => {
            if (err) {
                console.log("error in setting redis key", err);
                return res.status(500).json({ success: false, message: "Redis client error", code : -4 });
            }
            console.log(res);
        });

        const isMailSent =  await sendMail(req.body.email , otp , true);
        console.log(isMailSent);
        res.status(200).json({success : true , message : 'email sent successfully ' , code : 1 });
    } catch (error) {
        console.log("error in sending mail is : "  + error);
        res.status(410).json({success : false  ,message : 'error in sending mail : ' + error , code : -2})
    }
}