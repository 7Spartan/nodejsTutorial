const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback)=>{
        if (allowedOrigins.indexOf(origin) != -1 || !origin){ //should remove the !origin check after development
            callback(null, true); //null -> no error
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;