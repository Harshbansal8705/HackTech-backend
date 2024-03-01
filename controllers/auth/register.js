const { User } = require("../../models/User");

exports.register = async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
    } catch (e) {
        return res.status(400).json({ success: false, message: e });
    }
    console.log("User registered successfully" , user);
}