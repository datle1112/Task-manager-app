// const mongodb = require('mongodb');

// This method is gonna give us access to necessary functions in other to connect to database 
// It will give us ability to perform basic CRUD operations (create read update delete)
// const MongoClient = mongodb.MongoClient; 
// const ObjectID = mongodb.ObjectID; 

// Since the stored variable has same name with property inside mongodb, we could use destructuring method for ES6 objects 
const { MongoClient, ObjectID} = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017'; 
const databaseName = 'Task-manager-app'; // Name of database that we try to connect 

MongoClient.connect(connectionURL, {useNewUrlParser : true} , (error, client) => {
    if (error) {
        return console.log("Unbale to connect to server");
    }

    const db = client.db(databaseName); 
    // Define database we need to manipulate. It isn't necessary to create it by Robot 3T, just pick a name for database and mongoDB 
    // will automatically create it 
    

    // CREATE DOCUMENTS 
    // Define "collection" we try to insert document into. In this case,we choose "users" collection 
    // db.collection('users').insertOne({ // Insert single document into mongodb's collection
    //     name : 'DL',
    //     age : 21
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert document to "user" '); 
    //     }
    //     console.log(res.ops); // result.ops contains all document belong to collection "users"
    // })


    // READ DOCUMENTS 
    // db.collection('task').findOne({ _id : new ObjectID('5cb5bf87fb2f0845042f8065')}, (error,task) => {
    //     // If you want to find data by "_id", we need to use ObjectID to transform string value to binary type
    //     if (error) {
    //         return console.log("Unable to fetch");
    //     }
    //     console.log(task);
    // })
    // db.collection('task').find({completed : false}).toArray((error, task) => {
    //     console.log(task);
    // })


    // // UPDATE DOCUMENTS 
    // // Follow "update operators" of mongoDB 
    // db.collection('users').updateOne({_id : new ObjectID('5cb5c5ff8395d516ac6c61b7')}, 
    // {
    //     $set: {
    //         name : 'Dat'
    //     },
    //     $inc : {
    //         age : 1
    //     }
    // }).then((result) => {
    //     console.log('Update successfully !');
    // }).catch((error) => {
    //     console.log('Error');
    // }) // For "updateOne" and "updateMany", the return will be "promises" if callback isn't passed
    // db.collection('task').updateMany({completed : false}, {
    //     $set : {
    //         completed : true
    //     }
    // }).then((result) => {
    //     console.log("Update successfully !!");
    // }).catch((error) => {
    //     console.log("Error");
    // })

    // DELETE DOCUMENTS 
    // db.collection('users').deleteOne({name : 'DL'}).then((result) =>{
    //     console.log("Delete successfully !!");
    // }).catch((error) => {
    //     console.log("Error");
    // })
});
