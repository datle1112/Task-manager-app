// Modularize route handle of "task" for later use purpose 
const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../model/task'); 
module.exports = router; 

// CONFIGURING RestAPI FOR CREATING RESOURCES
// router.post('/tasks', (req,res) => {
//     const task = new Task(req.body);
//     task.save().then(() => { // Save new task to database "task-manager-api", model "Task"
//         res.status(201).send(task);
//         console.log("Successfully create new task");
//     }).catch((error) => {
//         res.status(400).send(error);
//     });
// });
router.post('/tasks', auth, async (req,res) => {
    // Since we already have auth() middleware for authentication purpose, we need to restructure code in this block 
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body, // Fetch all data from req.body (key-value pairs) to new "task" obejct
        owner : req.user._id 
        // We need to hard-code "owner" variable (used to stored _id of user who creates tasks) since we don't want to send 
        // it to server as part of request's body such as "user" object data or "token" data. 
    })
    try {
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send(e);
    }
})


//// CONFIGURING RestAPI FOR READING RESOURCES
router.get('/tasks', auth, async (req,res) => { // Adding auth middleware 
    const match = {} // Create object "match" to store all requires from user 

    if (req.query.completed) { // Check whether "completed" attribute is supplied as part of URL or not
        match.completed = req.query.completed === 'true';
        // In this case, we try to set property "completed" of obejct "match" to Boolean value. However, if we just type 
        // match = completed = req.querry.completed, this solution wont work and we only receive string value since 
        // we didn't specify "completed" property to Boolean value
        // If req.query.completed === "true" => match.completed = TRUE (boolean, not string)
        // If req.query.completed !== "true" => match.completed = FALSE (boolean, not string)
    }

    try {
        // First approach : Modify .find() function 
        // const tasks = await Task.find({owner : req.user._id});
        // res.send(tasks);

        // Second approach : Using populate() to fetch data
        // In other to filter task's data that is sent back to user, we have to restructure populate() function  
        
        await req.user.populate({
            path : 'tasks',
            match, // Passing object "match", which is created above, as a property of populate()
            options : {
                // Number of resources returned in one request 
                limit :  parseInt(req.query.limit), // Convert string contains number into actual integer since all passing values from req.querry is String
                // Allow you to iterate over pages
                // Ex: If we have limit = 2 and skip = 0, page will return first 2 results. And if we continue to request with limit = 2 and skip = 2,
                // page will return NEXT 2 results
                skip : parseInt(req.query.skip)
            }
        }).execPopulate();
        
        res.send(req.user.tasks);
    } catch(e) {
        res.status(500).send();
    }
});
router.get('/tasks/:id', auth, async (req,res) => { // Adding auth middleware 
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner : req.user._id});
        
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch(e) {
        res.status(500).send();
    }
});


//// CONFIGURING RestAPI FOR UPDATING RESOURCES
router.patch('/tasks/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["task", "completed"];
    const isAllowed = updates.every((update) => allowedUpdates.includes(update));
    if (!isAllowed) {
        return res.status(400).send({error : "Invalid change!"});
    }
    try{
        // "findbyIdAndUpdate" method automatically bypasses mongoose and performs a direct operation on database so we can't use it 
        // to apply middleware  
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true});

        // New method 
        // const task = await Task.findOne(req.params.id);
        const _id = req.params.id; // Store ObjectID of task 
        const task = await Task.findOne({ _id, owner : req.user._id}); 

        if (!task) {
            return res.status(404).send({error : "Can not find resource!"});
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch(e) {
        res.status(400).send(e);
    }
})


// CONFIGURING RestAPI FOR DELETING RESOURCES 
router.delete('/tasks/:id', auth, async (req,res) => {
    try{
        // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOne({_id : req.params.id, owner : req.user._id});
        if (!task) {
            return res.status(404).send({error : "Can not find resource!"});
        }
        await task.remove();
        res.send(task);
    } catch(e) {
        res.status(400).send();
    }
})


