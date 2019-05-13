const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../model/user');
const Task = require('../../model/task');

// Create data for our testing database "task-manager-api-test" in localhost 
const userOneId = new mongoose.Types.ObjectId()
const userOne = { 
    _id : userOneId,
    name : "Arya",
    email : "stark@gmail.com",
    password : "12345678",
    tokens : [{
        token : jwt.sign({_id : userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = { 
    _id : userTwoId,
    name : "Sansa",
    email : "winterfell@gmail.com",
    password : "12345678",
    tokens : [{
        token : jwt.sign({_id : userTwoId}, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id : new mongoose.Types.ObjectId(),
    task : 'Learn NodeJs',
    completed : false,
    owner : userOneId
}

const taskTwo = {
    _id : new mongoose.Types.ObjectId(),
    task : 'Learn HTML + CSS',
    completed : true,
    owner : userOneId
}

const taskFour = {
    _id : new mongoose.Types.ObjectId(),
    task : 'Learn NodeRed',
    completed : true,
    owner : userOneId
}

const taskThree = {
    _id : new mongoose.Types.ObjectId(),
    task : 'Learn AWS',
    completed : true,
    owner : userTwoId
}


const setupDatabase = async () => {
    // If we don't provide any argument for "deleteMany()", it gonna detele all records
    await User.deleteMany(); // "deleteMany()" is an asynchronous function and we have to tell Jest that 
    await Task.deleteMany();
    // Wiping out the database before testing is a good approach. However, if we want to test "/users/login" route, our database must have 
    // at least one user. We have to create that user AFTER "deleteMany()" function 
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
    await new Task(taskFour).save();
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    taskFour,
    setupDatabase
}