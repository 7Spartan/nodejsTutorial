const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

let saltRound = 10;


const handleNewUser = async(req,res) =>{
    const {user,pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({"message":"username and password are required!"});
    //check for duplicate usernames in DB
    const duplicate =  usersDB.users.find(person=>person.username === user);
    if(duplicate) return res.sendStatus(409); // status code stands for conflict
    try{
        //encrypt the pwd
        const hashedpwd = await bcrypt.hash(pwd,saltRound);
        //store the new user
        const NewUser = {"username":user,"pwd":hashedpwd};
        usersDB.setUsers([...usersDB.users,NewUser]);
        await fsPromises.writeFile(
            path.join(__dirname,'..','model','users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        res.status(201).json({"message":`New user ${user} created!`});
    }catch(err){
        res.status(500).json({"message":err.message});
    }
}

module.exports = {handleNewUser};