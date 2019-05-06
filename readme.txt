Step by step to create "Task Manager App"
1. Create "User" and "Task" model 
    1.1. Create Schema of these models ("userSchema" and "taskSchema") to get benefit from middleware functions 
    1.2. Use these schema as second parameter from mongoose.model() function (first parameter is name of model)
2. Create index.js to initialize Express server 
3. Create route handler for "User" and "Task" 
    3.1. Create two seperated files for "User" and "Task" and then import it back to "index.js"
    3.2. There are four types of predefined operation and our job is handling all of them by using router. (instead of app. since 
    we have to import them to "index.js") : 
        Create <=> POST 
        Read <=> GET
        Update <=> PATCH
        Delete <=> DELETE
4. Integrating middleware and external functions, features
    4.1. Authentication is crucial part of all system and we can integrate it into our application by using middleware function "auth()" (this function 
    is manually defined by programmer in "User" model). 
        4.1.1. We using npm library "bscriptjs" to hash input password from users and then store it in DB
        4.1.2. Adding Json Web Token by using npm library "jsonwebtoken". Basically, user can only access to POST('/users') and POST('/users/login') until they pass correct email and password.  

        4.1.3. Passing email and password from user will be checked by function "findByCredentials" (manually defined by progammer to find)
        4.1.4. If Express server could find user's data that is matched with input information, an "json web token" (jwt) will be passed and store inside 
        "User" model's instance (in "tokens" property). 

        4.1.5. After that, After that, this token is sent to server (as a part of header in request) and server will execute vadilation process
        The header sends jwt to server by a pair of key-value:
            key : Authorization
            value : Bearer (jwt)
        4.1.6. Finally, user will have rights to access to other route handler if everything work properly

    4.2. We also need to modify returned data of user after authentication process since user does not need to see their own password and jwt. We use .toJson() function to handle that problem

    4.3. The relationship between "User" and "Task" models need to be created in case user ask for number of created tasks by him/her or vice versa. We solve this problem in two ways: 
        4.3.1. For one-one relationship (using conventional populate): 
        For example, We will try to find user who created task. To fire it off, we need to store ObjectID of user who create this task inside "Task" model, this information is availabe in req.user after go through auth() middleware. After that, we will find user by this ObjectID and then fetch related data of user by using populate() and execPopulate()   

        4.3.2. For one-many relationship (using virtual populate): 
        For example, we will try to find tasks created by individual user. The method to handle this task is quite different with previous one since it isn't an effective idea when creating an array to store ObjectID of tasks created by user. The reason is that one task can only created by one user but one user can create many tasks and if we include this information inside "User" model, it will unnecessarily expand database and also reduce bandwidth when sending data back and fore. An effective approach in this situation is creating a virtual data which will store created tasks data and we will access that data whenever we want 
    
    4.4. Since returned user's data is already modified in step 4.2, we only have to modify returned task data. Basically, it isn't a good idea to return all tasks to user when they send request GET('/task') to Express server. We could use URL query to solve this problem and let user choose how they want to receive task's data. There are three integrated features for user to use: 
        4.4.1. "Filter data" feature: Only return completed/uncompleted tasks, usng "match" property in "populate()" to handle
                Basic structure of URL : /tasks?completed=true 

        4.4.2. "Paginating data" feature: Limit number of returned task per one request, using "limit" and "skip" property in "populate()" to handle
                Basic structure of URL : /tasks?limit=1&skip=0

        4.4.3. "Sorting data" feature : Choosing a field to sort and return task's data based on this field (in acsending 'asc' or descending 'des'order). For example, user want to have returned tasks from oldest to newest. In this case, choosen field is "createdAt" and order is "acs"
                Basic structure of URL : /tasks?sortBy=sortField:order (sortField is choosen field to sort and order is either "asc" or "des")

