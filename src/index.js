// This file is used to initialize Express server

//// Predefined operation (CRUD) for resources of HTTP method: 
/* 
Create <=> POST 
Read <=> GET
Update <=> PATCH
Delete <=> DELETE
*/
const express = require('express');
require('./db/mongoose.js'); // Connect mongoose to mongoDB 
const userRouter = require('../src/routers/user');
const taskRouter = require('../src/routers/task');

const app = express();
const port = process.env.PORT || 3000; // In case we only want to run this application on localhost, we can use port 3000 as normal.


app.use(express.json()); 
// Configuring express to automatically pass incoming JSON data to an object so we can access it in 
// our request handlers
app.use(userRouter); // Using import route handle for "user"
app.use(taskRouter); // Using import route handle for "task"


app.listen(port, () => { // This routerlication will be deployed on Heroku and it will run on specific port that Heroku provide 
    console.log(`Server is running on port ${port}`); 
});
