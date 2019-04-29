const jwt = require('jsonwebtoken'); // This library is imported to validate provided jwt
const User = require('../model/user'); // Find user in database after authentication process
const auth = async (req, res, next) => {
    // The operation of authentication process : First user have to login or sign up accout to receive json web token (jwt). After that, this token is 
    // sent to server as a part of header in request and server will execute vadilation process. 
    // The header sends jwt to server by a pair of key-value:
    // key : Authorization
    // value : Bearer (jwt)
    try {   
        // First we need to access to jwt inside header (inside request)
        const token = req.header('Authorization').replace("Bearer ", ""); 
        const decoded = jwt.verify(token,'haha'); // "decoded" variable stores _id and created time of user 
        const user = await User.findOne({
             _id : decoded._id,
             'tokens.token' : token 
             // we have to check whether passing token is part of tokens array since we will delete that token when user log out.
             // We use string property name when there is a special character inside property 
        });
        
        if (!user) { // Check if we could find corret user 
            throw new Error();
        }
        // Sending authentication and user object data as part of request to Express server
        req.token = token;
        req.user = user;
        next() // If user is found with correct _id and authentication token, we will call next() function 
    } catch {
        res.status(401).send({error : "Please authenticate"});
    }
    
};

module.exports = auth;