exports.getUser = (req ,res)=>{
    try {
        console.log(req.user);
        if(req.user){
            res.status(200).json({succes : true , message: 'user fetched successfully ' , data : req.user });
        }
        res.status(400).json({success : false , message : 'could not fetch user' , code : -1 })
    } catch (error) {
        console.log('error in getting user is : ' + error );
    }
}