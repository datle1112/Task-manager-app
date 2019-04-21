const mongoose = require('mongoose');

// Create "Task" model
const Task = mongoose.model('Task',{
    task : {
        type : String,
        trim : true,
        required : true
    },
    completed : {
        type : Boolean,
        default : false
    }
})

module.exports = Task;

