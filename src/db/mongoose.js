const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', { // Connect mongoose to database
    useNewUrlParser : true,
    useCreateIndex : true 
    // This option makes sure that when mongoose works with mongoDB, our indexes are created allowing us to quickly
    // access to data we want to access 
}); 
const User = mongoose.model("User", { // "model" method accepts two arguments: First is name of model and second one is defination of this model
    name : {
        type : String, 
        require : true
    },
    email : {
        type : String,
        require : true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    age : {
        type : Number,
        validate(value) { // Create custom validator for this property (ES6 syntax)
            if (value < 0) {
                throw new Error('Age must be positive number');
            }
        }
    }
}); 
// const Task = mongoose.model('Task',{
//     task : {
//         type : String,
//         require : true
//     },
//     completed : {
//         type : Boolean
//     }
// })
const user1 = new User({
    name : 'Dat Le',
    age : -1
});
user1.save().then(() => {
    console.log(user1);
}).catch((error) => {
    console.log('Error',error);
})

// const task1 = new Task({
//     task : "Gym",
//     completed : false
// });

// task1.save().then(() => {
//     console.log(task1);
// }).catch((error) => {
//     console.log("Error");
// })

// Data validation : Enforce data to follow some rules
// Data sanitiztion : Allow us to alter the data before saving it 
