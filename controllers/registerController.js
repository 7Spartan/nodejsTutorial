const User = require('../model/User')
const bcrypt = require('bcrypt');

let saltRound = 10;

const handleNewUser = async(req,res) =>{
    const {user,pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({"message":"username and password are required!"});
    //check for duplicate usernames in DB
    const duplicate =  await User.findOne({username: user}).exec();
    if(duplicate) return res.sendStatus(409); // status code stands for conflict
    
    try{
        //encrypt the pwd
        const hashedpwd = await bcrypt.hash(pwd,saltRound);
        
        // Create and store the new user at once
        const result = await User.create({
            "username":user,
            "password":hashedpwd
        });
        
        console.log(result);

        res.status(201).json({"message":`New user ${user} created!`});
    }catch(err){
        res.status(500).json({"message":err.message});
    }
}

module.exports = {handleNewUser};
