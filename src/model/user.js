// Create "User" model
const mongoose = require('mongoose');
const validator = require('validator');
const bscrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Mongoose supports middleware, which is used to adjust behavior of mongoose's models 
// In other to ultilize functionalities of mongoose's middleware, we need to create "schema" of mongoose's model
const userSchema = new mongoose.Schema({ 
    name : {
        type : String, 
        required : [true,"Please provide username"],
        trim : true // Make sure that no space in "name" property 
    },
    password : {
        type : String,
        required : true,
        trim : true, 
        minlength : 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password can not contain string "password" ');
            } 
        } 
    },
    email : {
        type : String || Number,
        unique : true, // Make sure that each email is unique 
        required : true,
        trim : true,
        lowercase : true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    age : {
        type : Number,
        default : 0,
        validate(value) { // Create custom validator for this property (ES6 syntax)
            if (value < 0) {
                throw new Error('Age must be positive number');
            }
        }
    },
    tokens : 
    // This property is created to keep track on generated token for individual user. As long as json web token exits means the user is logged in
    // and if json web token isn't tracked, user has no way to logout and invalidate given token
    // We will use an array of object to keep track on generated token
    [{  
        token : {
            type : String,
            required : true
        }
    }]
});

/* There are two accessible methods for middleware
  "pre" : Doing something before events
  "post" : Doing something after events
*/
//// Define new function to verify user of by using "statics"
// which allows us to create function that exists directly on mongoose's model
userSchema.statics.findByCredentials = async (email, password) => { // Arrow functiom is used since "this" binding isn't important
    const user = await User.findOne({email});
    if (!user) {
        throw new Error('Invalid login');
    } 

    const isMatch = await bscrypt.compare(password,user.password);
    if (!isMatch) {
        throw new Error('Invalid login');
    }
    return user;
}
//// Define new function for an "instance" of "User" model by using "methods" since we will generate Json Web token for specific user 
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'haha'); 
    // Since user._id is the ObjectID, we need to convert it to string, which jsonwebtoken expects 
    // First argument is element that uniquely identifies the user (in this case we use ObjectID), second argument is "secret" 

    // Save new token to "token" property of "User"
    user.tokens = user.tokens.concat({token});
    // The method we use is "concat()". Basically, "concat()" and "push()" are similar to each other when their function is combining two strings.
    // The difference is that "push()" will change original string and the return value of "push()" function is LENGHT of new string, while 
    // "concat()" doesn't change original string and the return value is NEW STRING
     
    await user.save(); // Make sure the user with tokens's property is saved to database 
    return token;

}
////
userSchema.methods.toJSON = function () { 
    // Using toJSON() to manipulate passing JSON object to response 
    // The return value of this method is used in calls to JSON.stringify(doc) which occurs in res.send() method 
    // In more detail, whenever an JSON object (A) is sent by res.send() method, it will be sent through response by "JSON.stringify(A)"
    const user = this;
    const userObject = user.toObject(); // userObject variable contains all raw data from individual "user" object

    // Manipulate return JSON object
    delete userObject.password
    delete userObject.tokens 

    return userObject;
}
//// Hash the plain text password before saving 
userSchema.pre("save", async function(next) {
    // First argument is "name of event" and second one is "executed function"
    // The executed function must be standard function, not arrow since "this" binding plays an important role
    const user = this; // Access to individual user that's about to be saved through variable "user"
    
    // We only want to hash the password when it's first created or modified (updated) by user
    if (user.isModified('password')){ 
        user.password = await bscrypt.hash(user.password, 8); 
        // First argument is plain text to hash,second is number round to execute algorithm 
    } 
    next();
    // next() is a callback function, which will be called after all code inside this block are executed 
    // This action will notify our program that middleware is successfully executed 
});

// "model" method accepts two arguments: First is name of model and second one is defination of this model (schema)
const User = mongoose.model("User", userSchema);
module.exports = User;
