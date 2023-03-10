const express = require('express');
require('dotenv').config();
const app = express();
const path = require('path');
const cors = require('cors');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;
const connectDB = require('./config/dbConn')


// Connect to MongoDB
connectDB();

// Custom middleware logger
app.use(logger);

// credentials js contains setting the header for CORS to be true
app.use(credentials);

// cors - cross origin resource sharing
app.use(cors(corsOptions));

// built-in middleware to handle url encoded form data
app.use(express.urlencoded({extended: false}));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use('/',express.static(path.join(__dirname,'/public')));

//routes
app.use('/',require('./routes/root'));
app.use('/register',require('./routes/register'));
app.use('/auth',require('./routes/auth'));
app.use('/refresh',require('./routes/refresh'));
app.use('/logout',require('./routes/logout'));

// Everything after the verifyJWT middlewear will need authentication
app.use(verifyJWT);
app.use('/employees',require('./routes/api/employees')) //doesn't need any static files since it is sending only data
app.use('/users',require('./routes/api/users')) //doesn't need any static files since it is sending only data


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
mongoose.connection.once('open',() =>{
    console.log('Connected to MongoDB');
    app.listen(PORT,()=> console.log(`server running on port ${PORT}`));
});


