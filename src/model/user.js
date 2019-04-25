// Create "User" model
const mongoose = require('mongoose');
const validator = require('validator');
const bscrypt = require('bcryptjs');
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
        type : String,
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
    }
});

/* There are two accessible methods for middleware
  "pre" : Doing something before events
  "post" : Doing something after events
*/
userSchema.pre("save", async function(next) {
    // First argument is event's name and second one is executed function
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
