const User = require('../model/User');
const handleLogout = async(req,res)=>{
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204); // Successful and No content to send back
    const refreshToken = cookies.jwt;

    // is refreshToken in DB?
    const foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser) {
        res.clearCookie('jwt',{ httpOnly : true, sameSite: 'None', secure: true});
        return res.sendStatus(204); // Forbidden
    }
    
    // Delete the refresh token in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt',{ httpOnly: true, sameSite: 'None', secure: true}); // add secure: true in production - only serves on https
    res.sendStatus(204);
}

module.exports = {handleLogout};