const { User } = require("../../models/User");

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
    return res.status(411).json({success : false , message : 'error : ' +e , code : -1})
}
}
exports.verifyOTPForSignup = async (req, res) => {
    try {
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
       
            res.status(200).json({ success: true, message: "otp verified successfully !!" });
        } else {
            // OTP verification failed
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    } catch (e) {
        res.status(400).json({ success: false, message: e.message })
    }
  }