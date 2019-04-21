// Create "User" model
const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model("User", { // "model" method accepts two arguments: First is name of model and second one is defination of this model
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

module.exports = User;
