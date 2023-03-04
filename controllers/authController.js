const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fspromises = require('fs').promises;
const path = require('path');

const handleLogin = async(req,res)=>{
    const {user,pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({"message":"username and password are required!"});
    const foundUser = usersDB.users.find(person=>person.username === user);
    if(!foundUser) return res.sendStatus(401);//Unauthorized
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match){
        const roles = Object.values(foundUser.roles);
        // create JWTs (JSON web token)
        const accessToken = jwt.sign(
            {"UserInfo":{
                "username":foundUser.username,
                "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'60s'}
        );
        const refreshToken = jwt.sign(
            {"username":foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:'1d'}
        );
        // Saving refresh token with current user
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = {...foundUser, refreshToken};
        usersDB.setUsers([...otherUsers, currentUser]);
        await fspromises.writeFile(
            path.join(__dirname,'..','model','users.json'),
            JSON.stringify(usersDB.users)
        );
        // http only cookie is not available to js. Hence, much secure
        res.cookie('jwt', refreshToken,{ httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 100});
        // If using thunderclinet to test the refresh token, remove the secure attribute from the cookie
        // res.cookie('jwt', refreshToken,{ httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 100});
        res.json({ accessToken });
    }else{
        res.sendStatus(401);
    }
}
module.exports = {handleLogin};