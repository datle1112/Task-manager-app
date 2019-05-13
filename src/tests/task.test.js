// This file contains test related to Task API route handle
// In other to prevent conflict in testing process when both test suites interact with same database, we have to make sure that 
// all tests occur sequentially. To do that, we add new flag to "test" script in "package.json" file. --runInBand flag is added along side 
// with --watch flag for "jest" 
const request = require('supertest');
const Task = require('../model/task');
const app = require('../app');
const { 
    userOne, 
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree, 
    taskFour,
    setupDatabase} = require('../tests/fixtures/db');


// Set up to wipe out mongoDB database BEFORE conducting test 
beforeEach(setupDatabase);

test("Should create new task", async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            task : 'Learn NodeJS',
            completed : false,
            owner : userOneId
        }).expect(201)
    // Assertion : Make sure that task is already created 
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull();
});

test('Should fetch all tasks for user one', async () => {
    const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    // Assertion make sure there are only TWO tasks created by user one
    expect(response.body.length).toEqual(3);
});

test('Should not detele task', async () => {
    await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .expect(404)

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
})

test("Should fetch only incompleted task", async () => {
    const response = await request(app)
    .get('/tasks?completed=false')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    expect(response.body.length).toEqual(1)
})

test("Should only fetch two tasks of user one", async () => {
    const response = await request(app)
    .get('/tasks?limit=2')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    
    expect(response.body.length).toEqual(2);
})

test("Should sort 2 first created tasks by user one in des order", async() => {
    const response = await request(app)
    .get('/tasks?sortBy=createdAt:des&limit=2')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    expect(response.body[0].task).toBe(taskFour.task);
    expect(response.body[1].task).toBe(taskTwo.task);
})

