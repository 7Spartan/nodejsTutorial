const express = require('express');
const router = express.Router();
const path = require('path');

// ^ef$ => ^ -> request Beggins with e; $ -> request ends with f
// index(.html)? -> .html is optional if used with () ? 
router.get('^/$|/index(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','subdir','index.html'));
});

router.get('/test(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','subdir','test.html'));
});

module.exports = router;