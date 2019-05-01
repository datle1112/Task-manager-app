const mongoose = require('mongoose');

// Create "Task" model
const Task = mongoose.model('Task',{
    task : {
        type : String,
        trim : true,
        required : [true, "Please provide description for task"]
    },
    completed : {
        type : Boolean,
        default : false
    },
    owner : { // Store id of individual user, who creates this task
        type : mongoose.Schema.Types.ObjectId, // Type of this object is ObjectID and to perform that, we need to use mongoose
        required : true, 
        ref : "User" // Establish connection between "user" property of "Task" model and "User" model
    }
});

module.exports = Task;

