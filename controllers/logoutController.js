const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
}

const fspromises = require('fs').promises;
const path = require('path');

const handleLogout = async(req,res)=>{
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204); // Successful and No content to send back
    const refreshToken = cookies.jwt;
    // is refreshToken in DB?

    const foundUser = usersDB.users.find(person=>person.refreshToken === refreshToken);
    if(!foundUser) {
        res.clearCookie('jwt',{ httpOnly : true, sameSite: 'None', secure: true});
        return res.sendStatus(204); // Forbidden
    }
    
    // Delete the refresh token in db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser,refreshToken:''};
    usersDB.setUsers([...otherUsers,currentUser]);
    await fspromises.writeFile(
        path.join(__dirname,'..','model','users.json'),
        JSON.stringify(usersDB.users)
    );

    res.clearCookie('jwt',{ httpOnly: true, sameSite: 'None', secure: true}); // add secure: true in production - only serves on https
    res.sendStatus(204);
}

module.exports = {handleLogout};