// Connect with database mongoDB 

const mongoose = require('mongoose');

// Data validation : Enforce data to follow some rules
// Data sanitiztion : Allow us to alter the data before saving it 

mongoose.connect(process.env.MONGODB_URL, { // Connect mongoose to database
    useNewUrlParser : true,
    useCreateIndex : true,
    // This option makes sure that when mongoose works with mongoDB, our indexes (userCreateIndex) are created allowing us to quickly
    // access to data we want to access 
    useFindAndModify : false 
    // True by default. Set to false to make findOneAndUpdate() and findOneAndRemove() 
    // use native findOneAndUpdate() rather than findAndModify().
}); 
