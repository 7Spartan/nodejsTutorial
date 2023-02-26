
const whitelist = [
    'https://www.mydomain.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500'
];

const corsOptions = {
    origin: (origin, callback)=>{
        if (whitelist.indexOf(origin) != -1 || !origin){ //should remove the !origin check after development
            callback(null, true); //null -> no error
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;