// This file is used to initialize Express server
const express = require('express');
require('./db/mongoose.js'); // Connect mongoose to mongoDB 
const User = require('./model/user');

const app = express();
const port = process.env.PORT || 3000; // In case we only want to run this application on localhost, we can use port 3000 as normal.

app.use(express.json()); 
// Configuring express to automatically pass incoming JSON data to an object so we can access it in 
// our request handlers

app.post('/users', (req, res) => {
    const user = new User(req.body);
    user.save().then(() => {
        res.status(201).send(user); // Configure HTTP response status code
        console.log("Successfully create new user");
    }).catch((error) => {
        res.status(400).send(error);
        console.log("Error", error)
    })
})

app.listen(port, () => { // This application will be deployed on Heroku and it will run on specific port that Heroku provide 
    console.log(`Server is running on port ${port}`); 
});
