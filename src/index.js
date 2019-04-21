// This file is used to initialize Express server
const express = require('express');
require('./db/mongoose.js'); // Connect mongoose to mongoDB 
const User = require('./model/user');
const Task = require('./model/task');

const app = express();
const port = process.env.PORT || 3000; // In case we only want to run this application on localhost, we can use port 3000 as normal.

app.use(express.json()); 
// Configuring express to automatically pass incoming JSON data to an object so we can access it in 
// our request handlers



//// CONFIGURING RestAPI FOR CREATING RESOURCES
app.post('/users', (req, res) => {
    const user = new User(req.body); // Incoming JSON data could be accessed via "req.body" 
    user.save().then(() => {
        res.status(201).send(user); // Configure HTTP response status code
        console.log("Successfully create new user");
    }).catch((error) => {
        res.status(400).send(error);
        console.log("Error", error)
    });
});

app.post('/tasks', (req,res) => {
    const task = new Task(req.body);

    task.save().then(() => { // Save new task to database "task-manager-api", model "Task"
        res.status(201).send(task);
        console.log("Successfully create new task");
    }).catch((error) => {
        res.status(400).send(error);
    });
});



//// CONFIGURING RestAPI FOR READING RESOURCES
app.get('/users',(req,res) => {
    User.find({}).then((users) => { // If we don't provide any parameter to "find()" method, it will fetch all data from database 
        res.status(200).send(data);
    }).catch((error) => {
        res.status(500).send();
    });
});
app.get('/users/:id', (req,res) => { 
    // The _id parameter of each parameter is different from others. Therefore, we need to access to route parameters, which 
    // is a part of URL and is used to capture dynamic values

    // The route parameter is marked by ":" after forward slash and the name of route parameter could be anything we want
    // In this case, route parameter is named "id"
    
    const _id = req.params.id; // Access to route parameter 

    User.findById(_id).then((user) => {
        // mongoDB does not considers "failure" when it can't send any results back to us when we're looking for something, 
        // it considers that as "Success". In other word, the first function (resolve) is going to run eventhough we might not always have result 
        // Therefore, we need conditional logic to keep everything work correctly
        if (!user) { 
            res.status(404).send();
        } else {
            res.send(user);
        }
    }).catch((error) => {
        res.status(500).send();
    });
});

app.get('/tasks', (req,res) => { 
    Task.find({}).then((tasks) => {
        res.send(tasks);
    }).catch((e) => {
        res.status(500).send();
    });
});
app.get('/tasks/:id', (req,res) => {
    const _id = req.params.id;

    Task.findById(_id).then((task) => {
        if (!task) {
            res.status(404).send();
        } else {
            res.send(task);
        }
    }).catch((e) => {
        res.status(500).send();
    });
});




app.listen(port, () => { // This application will be deployed on Heroku and it will run on specific port that Heroku provide 
    console.log(`Server is running on port ${port}`); 
});
