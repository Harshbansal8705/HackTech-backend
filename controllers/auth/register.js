const { User } = require("../../models/User");

exports.register = async (req, res) => {
    const user = new User(req.body);
    try {
        await user.validate();
    } catch (e) {
        return res.status(400).json({ success: false, message: e });
    }
    await user.save();
    console.log("User registered successfully" , user);
}