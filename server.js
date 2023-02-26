const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 3500;

// Custom middleware logger
app.use(logger);

// cors - cross origin resource sharing
app.use(cors(corsOptions));

// built-in middleware to handle url encoded form data
app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use('/',express.static(path.join(__dirname,'/public')));

//routes
app.use('/',require('./routes/root'));
app.use('/employees',require('./routes/api/employees')) //doesn't need any static files since it is sending only data

app.all('*',(req,res)=>{
    res.status(404);
    // If we don't add the 404 status code, it will send a 200 as it found the custom 404.html page
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));
    }else if(req.accepts('json')){
        res.json({error: "404 Not Found"});
    }else{
        res.type('txt').send("404 Not found");
    }
});

app.use(errorHandler);

app.listen(PORT,()=> console.log(`server running on port ${PORT}`));
