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
    }
})

module.exports = Task;

