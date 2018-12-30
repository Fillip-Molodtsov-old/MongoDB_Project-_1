const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err) return console.log('Error with connecting to the database');
    console.log('Connected to the data base');
    const db = client.db('TodoApp');
    db.collection('Todos').insertOne({
        text:'first document',
        completed:true,
    },(err,result)=>{
        if(err) return console.log('Error with adding the document',err);
        console.log(JSON.stringify(result.ops,undefined,2));
    });
    // db.collection('Users').insertOne({
    //     name:'Phil',
    //     age:18,
    //     location:'Kyiv',
    // },(err,result)=>{
    //     if(err) return console.log('Error with adding the document to Users collection',err);
    //     console.log(JSON.stringify(result.ops,undefined,2));
    // })
    client.close();
})