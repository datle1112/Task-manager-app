// Modularize route handle of "task" for later use purpose 
const express = require('express');
const router = new express.Router();
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
router.post('/tasks', async (req,res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        res.status(400).send(e);
    }
})


//// CONFIGURING RestAPI FOR READING RESOURCES
router.get('/tasks', async (req,res) => { 
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch(e) {
        res.status(500).send();
    }
});
router.get('/tasks/:id', async (req,res) => {
    const _id = req.params.id;
    try {
        const task =  await Task.findById(_id);
        if(!task) {
            return res.status(404).send({error : "Can not find resource!"});
        }
        res.send(task);
    } catch(e) {
        res.status(500).send();
    }
});


//// CONFIGURING RestAPI FOR UPDATING RESOURCES
router.patch('/tasks/:id', async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["task", "completed"];
    const isAllowed = updates.every((update) => allowedUpdates.includes(update));
    if (!isAllowed) {
        return res.status(400).send({error : "Invalid change!"});
    }
    try{
        // "findbyIdAndUpdate" method automatically bypasses mongoose and performs a direct operation on database so we can't use it 
        // to apply middleware  
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators : true});

        // New method 
        const task = await Task.findById(req.params.id);
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        if (!task) {
            return res.status(404).send({error : "Can not find resource!"});
        }
        res.send(task);
    } catch(e) {
        res.status(400).send(e);
    }
})


// CONFIGURING RestAPI FOR DELETING RESOURCES 
router.delete('/tasks/:id', async (req,res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send({error : "Can not find resource!"});
        }
        res.send(task);
    } catch(e) {
        res.status(400).send();
    }
})


