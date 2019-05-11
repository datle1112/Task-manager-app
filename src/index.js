// This file is used to initialize Express server

//// Predefined operation (CRUD) for resources of HTTP method: 
/* 
Create <=> POST 
Read <=> GET
Update <=> PATCH
Delete <=> DELETE
*/
const app = require('../src/app');
const port = process.env.PORT; // In case we only want to run this application on localhost, we can use port 3000 as normal.

app.listen(port, () => { // This routerlication will be deployed on Heroku and it will run on specific port that Heroku provide 
    console.log(`Server is running on port ${port}`); 
});