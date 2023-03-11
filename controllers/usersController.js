const User = require('../model/User');
const bcrypt = require('bcrypt');

const getAllusers = async(req,res)=>{
    const users = await User.find();
    if (!users) return res.status(204).json({'message':'NO users found.'});
    res.json(users);
}

const createNewUser = async(req,res)=>{
    if (!req?.body?.username || !req?.body?.password) {
        return res.status(400).json({'message':'Username and password are required'})
    }

    try{
        const hashedpwd = await bcrypt.hash(req.body.password,10);

        const result = await User.create({
            username: req.body.username,
            password: hashedpwd
        });
        res.status(201).json(`New user ${req.body.username} created`);
        console.log(result);

    }catch (err){
        console.error(err);
    }
}

const updateUserPassword = async(req,res)=>{
    if (!req?.body?.username || !req?.body?.password){
        return res.status(400).json({'message':'username and new password is required.'});
    }
    const user = await User.findOne({username: req.body.username}).exec();

    if(!user){
        return res.status(204).json({"message":`No User matches username ${req.body.username}`});
    }
    const hashedpwd = await bcrypt.hash(req.body.password,10);
    if (req.body?.password) user.password = hashedpwd;
    const result = await user.save();
    console.log(result);
    res.json({'message':'Password updated!'});
}

const deleteUser = async(req,res)=>{
    if (!req?.body?.id) return res.status(400).json({'message':'User ID is required'});

    const user = await User.findOne({_id: req.body.id}).exec();
    if(!user){
        return res.status(204).json({"message":`No User with ID ${req.body.id} found`});
    }

    const result = await user.deleteOne({_id: req.body.id});
    res.json(result);
}

const getUser = async(req,res)=>{
    if (!req?.params?.id) return res.status(400).json({'message':'User ID is required'});
    const user = await User.findOne({_id: req.params.id}).exec();
    if(!user){
        return res.status(204).json({"message":`User ID ${req.params.id} not found`});
    }
    res.json(user);
}

module.exports = {
    getAllusers,
    createNewUser,
    updateUserPassword,
    deleteUser,
    getUser
}