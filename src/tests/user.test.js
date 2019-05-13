// This file contains test related to User API route handle
// In other to prevent conflict in testing process when both test suites interact with same database, we have to make sure that 
// all tests occur sequentially. To do that, we add new flag to "test" script in "package.json" file. --runInBand flag is added along side 
// with --watch flag for "jest" 
const request = require('supertest'); // This npm library supports Promises so we could use async-await inside test 
const app = require('../app');
const User = require('../model/user');
const { 
    userOne, 
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree, 
    setupDatabase} = require('../tests/fixtures/db');


// Set up to wipe out mongoDB database BEFORE conducting test 
beforeEach(setupDatabase);

test('Should signup a new user', async () => {
    const response = await request(app) // All res data will be stored inside "response" variable 
    .post('/users').send({
        name : "D_L",
        email : "datle@gmail.com",
        password : "mypass111111111"
    }).expect(201)

    //// Adding advanced assertions 
    // Assert that the database was changed correctly 
    const _user = await User.findById(response.body.user._id);
    expect(_user).not.toBeNull() // Expect be able to find user with returned _id from "response"

    // Assertion about the response 
    expect(response.body).toMatchObject({
        user : {
            name : "D_L",
            email : "datle@gmail.com",
        },
        token : _user.tokens[0].token 
    })
    expect(_user.password).not.toBe('mypass111111111'); // Test that provided password is encrypted or not 
});

test('Should login existing user', async () => {
    const response = await request(app)
    .post('/users/login')
    .send(userOne)
    .expect(200)
    // Assertion : Token in "response" variable matches user's second token
    // The reason for second token is that when we create user "Arya", we already have one jwt (FIRST token). And route handle /users/login 
    // automaticallygenerate new token (SECOND token) for us so we have two token in total   
    const _user = await User.findById(response.body.user._id);
    expect(_user).not.toBeNull();
    expect(response.body).toMatchObject({
        token : _user.tokens[1].token
    })
});

test('Should not login nonexistent user', async () => {
    await request(app)
    .post('/users/login').send({
        email : "datle@gmail.com",
        password : "mypass111111111"
    }).expect(400);
});

test('Should get profile of user', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    // "auth()" function in Express server requires json web token (jwt) in request header "Authorization" 
    // We have to set up this header by using "set". First argument of "set()" is key of header (Authorization), 
    // second one is value (we use Bearer (jwt))
    .send()
    .expect(200)
});

test('Should not get profile of user', async () => {
    // In case we don't set request header "Authorization"
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
});

test("Should delete user's account", async () => {
    const response = await request(app)
    .delete('/users/me')
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    // Assertion : Validate user is removed 
    const _user = await User.findById(response.body._id);
    expect(_user).toBeNull();
});

test("Should not delete user's account", async () => {
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
});

test("Should upload user's avatar", async () => {
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','src/tests/fixtures/profile-pic.jpg') 
    // Attach file when conducting test. First argument is form field we're trying to set and second one is path to file we want to attach
    // (it starts from root of our project)
    .expect(200)

    // Assertion to check whether user's avatar is uploaded or not (check if property avatar of user contains Buffer data)
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer))
    // expect.any(constructor) matches anything that was created with the given constructor. In this case, we check if property "avatar"
    // of user contains Buffer data 
})

test("Should update valid user field", async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        name : 'Mike'
    })
    .expect(200)
    const user = await User.findById(userOneId);
    expect(user.name).toBe('Mike');
})

test('Should update invalid user field', async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        location : 'Finland'
    })
    .expect(400)
})

test("Should not signup user with invalid email", async () => {
    await request(app)
    .post('/users')
    .send({
        name : 'New user',
        password : '12345678',
        email : 'asdascczxcz'
    })
    .expect(400)
})

test("Shoud not update user if unauthenticated", async() => {
    await request(app)
    .patch('/users/me')
    .send({
        name : 'News'
    })
    .expect(401)
})

test("Should not update user with invalid email/password", async () => {
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        email : 'asdaczxc',
        password : '1'
    })
    .expect(400)
})