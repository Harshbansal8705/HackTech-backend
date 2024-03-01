const { User } = require("../../models/User");

exports.register = async (req, res) => {
    try{
    const user = new User(req.body);
    try {
        await user.validate();
    } catch (e) {
        return res.status(400).json({ success: false, message: e , code : -2 });
    }
    await user.save();
    console.log("User registered successfully" , user);
    return res.status(200).json({ success: true, message: "User registered successfully" , code : 1 });
}
catch(e){
    console.log('error in register is '+ e);
    return res.status(411).json({success : false , message : 'error : ' +e , code : -1})
}
}
