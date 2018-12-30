const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err) return console.log('Error with connecting to the database');
    console.log('Connected to the data base');
    const db = client.db('TodoApp');
    // (async ()=>{
    //     console.log(await db.collection('Todos').deleteMany({text:'first document'}));
    // })();
    (async ()=>{
    console.log(await db.collection('Todos').findOneAndDelete({_id:new ObjectID('5c28e6ff2c09d742f45c007e')}));
    })();
    client.close();
})