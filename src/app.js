/* 
This file is used for testing purpose 
We use "supertest" npm package to test Express application. It only requires Express application before .listen() is called. Therefore we have to 
create this seperated file instead using index.js
*/
const express = require('express');
require('./db/mongoose.js'); // Connect mongoose to mongoDB 
const userRouter = require('../src/routers/user');
const taskRouter = require('../src/routers/task');

const app = express();


app.use(express.json()); 
// Configuring express to automatically pass incoming JSON data to an object so we can access it in 
// our request handlers
app.use(userRouter); // Using import route handle for "User"
app.use(taskRouter); // Using import route handle for "Task"


module.exports = app; 