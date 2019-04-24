// Modularize route handle of "user" for later use purpose 
const express = require('express');
const router = new express.Router();
const User = require('../model/user');
module.exports = router;

// CONFIGURING RestAPI FOR CREATING RESOURCES
// router.post('/users', (req, res) => {
//     const user = new User(req.body); // Incoming JSON data could be accessed via "req.body" 
//     user.save().then(() => {
//         res.status(201).send(user); // Configure HTTP response status code
//         console.log("Successfully create new user");
//     }).catch((error) => {
//         res.status(400).send(error);
//         console.log("Error", error)
//     });
// });

// Rewrite code using async-await
router.post('/users', async (req,res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
})


//// CONFIGURING RestAPI FOR READING RESOURCES
router.get('/users', async (req,res) => {
    try { 
        const users = await User.find({}); // If we don't provide any parameter to "find()" method, it will fetch all data from database 
        res.send(users);
    } catch(e) {
        res.status(500).send()
    }
})
router.get('/users/:id', async (req,res) => {
    // The _id parameter of each documetn is different from others. Therefore, we need to access to "route parameter", which 
    // is a part of URL and is used to capture dynamic values

    // The "route parameter" is marked by ":" after forward slash and the name of route parameter could be anything we want
    // In this case, route parameter is named "id"
    const _id = req.params.id;
    try {
        user = await User.findById(_id);
        if (!user) {
        // mongoDB does not considers "failure" when it can't send any results back to us when we're looking for something, 
        // it considers that as "Success". In other word, the first function (resolve) is going to run eventhough we might not always have result 
        // Therefore, we need conditional logic to keep everything work correctly   
        return res.status(404).send({error : "Can not find resource!"});
        } 
        res.send(user);
    } catch(e) {
        res.status(500).send(e);
    }
});


//// CONFIGURING RestAPI FOR UPDATING RESOURCES
router.patch('/users/:id', async (req,res) => {
    // When we try to update properties that aren't existed in resources, The PATCH operation (Update) still return status code "200"
    // which means "successful" but the resource itself isn't updated anything. To prevent that situation as well as provide user
    // with better experience, an if-else logic condition is needed 

    const updates = Object.keys(req.body); // Return all update from req.body in array
    const allowedUpdate = ['name', 'age', 'email']; // Array contains allowed changes in "user"
    const isAllowed = updates.every((update) => allowedUpdate.includes(update)); 
    // Check if all elements in "updates" array are included in "allowedUpdate" array
    // If callback function inside "every" method is "true", the return value of "every" is "true". If there is only one "false", the
    // value of "every" will imediately be "false"

    // The used method is "every". Basically, this method is similar with "forEach" and "map", the difference is the return value 
    // "forEach" returns nothing, "map" returns an array after taking actions on original array and "every" only returns Boolean value 
    if (!isAllowed) {
       return res.status(400).send({error : "Invalid change!"});
    }
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true});
        if(!user) {
            return res.status(404).send({error : "Can not find resource!"});
        } 
        res.send(user);
    } catch(e) {
        res.status(400).send(e);
    }
});


//// CONFIGURING RestAPI FOR DELETING RESOURCES 
router.delete('/users/:id', async(req,res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send({error : "Can not find resource!"});
        }
        res.send(user);
    } catch(e) {
        res.status(500).send();
    }
});

