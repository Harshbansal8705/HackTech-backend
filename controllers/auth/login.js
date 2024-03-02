const { User } = require("../../models/User");
const speakeasy = require("speakeasy");
const jwt = require('jsonwebtoken');
const { sendMail } = require("../mailer");
const jwtSecret = process.env.JWT_SECRET;
const { client } = require("../../redis");
exports.loginWithEmail = async (req, res) => {
    try {
        if (!req.body.email) return res.status(400).json({ success: false, message: "Please enter email" , code : 1});

        const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("email").exec();
        if (!user) return res.status(400).json({ success: false, message: "User does not exist"  , code : -1 });

        const secret = speakeasy.generateSecret({ length: 20 });
        console.log(secret);

        // Generate OTP
        const otp = speakeasy.totp({
            secret: secret.base32,
            encoding: "base32"
        });
        console.log(otp);
        // save the secret key in the user object or database
        if (!client.isOpen) return res.status(500).json({ success: false, message: "Redis client error" , code : -4  });
        await client.set(user.email,  secret.base32, { EX: process.env.OTP_EXPIRE_TIME }, (err, res) => {
            if (err) {
                console.log("error in setting redis key", err);
                return res.status(500).json({ success: false, message: "Redis client error", code : -4 });
            }
            console.log(res);
        });

        
// Send OTP to user (e.g., via email or SMS)
        sendMail(req.body.email, otp);
        await user.save();
        return res.status(200).json({ success: true, message: "OTP sent to your email" , code : 0 });
     } catch (e) {
        console.log("error in loginWithOtp" , e.message)
        res.status(400).json({ success: false, message: e.message  , code : -3})
    }
}

exports.verifyOTPForLogin = async (req, res) => {
    try {
        const otp = req.body.otp;
        const user = User.findOne({ email : req.body.email });
        if (!otp) return res.status(400).json({ success: false, message: "Please enter OTP" });
        if (!client.isOpen) return res.status(500).json({ success: false, message: "Redis client error" });
        const secret = await client.get(req.body.email, (err, res) => {
            if (err) console.log(err);
            console.log(res);
        });
        console.log('secret is :', secret);
        // Verify OTP
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: "base32",
            token: otp,
            window: 3 // Allow 1-time step tolerance in verification
        });
        
        if (verified) {
            // OTP verification successful
            // Proceed with login logic
            const user = await User.findOne({email: req.body.email }).exec() 
            console.log('user is :', user);
            const maxAge = 96 * 60 * 60 * 1000 ;
            const token = jwt.sign({ user : user }, jwtSecret, { expiresIn: maxAge });
            console.log(token);
            res.cookie("jwt", token, {
              httpOnly: true,
              maxAge: maxAge , // 90days in ms
            });
            res.status(200).json({ success: true, message: "Logged in successfully" , user: user });
        } else {
            // OTP verification failed
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    } catch (e) {
        res.status(400).json({ success: false, message: e.message })
    }
  }