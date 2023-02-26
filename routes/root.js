const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','index.html'));
});

router.get('/new-page(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','new-page.html'));
});

router.get('/old-page(.html)?',(req,res)=>{
    // res.redirect('/new-page.html'); // response code will be 302  which doesn't tell the browser that the redirect is permanent
    res.redirect(301, '/new-page.html'); // Forcing to give a response code 301
});

module.exports = router;