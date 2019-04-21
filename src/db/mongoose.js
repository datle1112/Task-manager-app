const mongoose = require('mongoose');

// Data validation : Enforce data to follow some rules
// Data sanitiztion : Allow us to alter the data before saving it 

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', { // Connect mongoose to database
    useNewUrlParser : true,
    useCreateIndex : true 
    // This option makes sure that when mongoose works with mongoDB, our indexes (userCreateIndex) are created allowing us to quickly
    // access to data we want to access 
}); 


// Create "Task" model
// const Task = mongoose.model('Task',{
//     task : {
//         type : String,
//         trim : true,
//         require : true
//     },
//     completed : {
//         type : Boolean,
//         default : false
//     }
// })
// const task1 = new Task({ // Create new document of "Task" model
//     task : "Gym",
//     completed : false
// });
// task1.save().then(() => {
//     console.log(task1);
// }).catch((error) => {
//     console.log("Error");
// })

