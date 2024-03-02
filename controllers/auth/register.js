const { User } = require("../../models/User");
const {client} = require("../../redis");
const speakeasy = require('speakeasy');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
exports.register = async (req, res) => {
    try{
    const user = new User(req.body);
    try {
        await user.save();
    } catch (e) {
        return res.status(400).json({ success: false, message: e , code : -2 });
    }
    console.log("User registered successfully" , user);
    return res.status(200).json({ success: true, message: "User registered successfully" , code : 1 });
}
catch(e){
    console.log('error in register is '+ e);
    return res.status(411).json({success : false , error : e , code : -1})
}
}
exports.verifyOTPForSignup = async (req, res) => {
    try {
        const otp = req.body.otp;
        const email = req.body.email;
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
           
            console.log('user is :', email);
            const maxAge = 96 * 60 * 60 * 1000 ;
            const token = jwt.sign({ email : email }, jwtSecret, { expiresIn: maxAge });
            console.log(token);
            res.cookie("jwt", token, {
              httpOnly: true,
              maxAge: maxAge , // 90days in ms
            });
            res.status(200).json({ success: true, message: "otp verified successfully !!" , code : 1});
        } else {
            // OTP verification failed
            res.status(400).json({ success: false, message: "Invalid OTP" , code : -1});
        }
    } catch (e) {
        res.status(400).json({ success: false, message: e.message , code : -2 })
    }
  }