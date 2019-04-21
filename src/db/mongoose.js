const mongoose = require('mongoose');

// Data validation : Enforce data to follow some rules
// Data sanitiztion : Allow us to alter the data before saving it 

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', { // Connect mongoose to database
    useNewUrlParser : true,
    useCreateIndex : true 
    // This option makes sure that when mongoose works with mongoDB, our indexes (userCreateIndex) are created allowing us to quickly
    // access to data we want to access 
}); 
