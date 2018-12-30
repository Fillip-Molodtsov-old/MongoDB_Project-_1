const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true },(err,client)=>{
    if(err) return console.log('Error with connecting to the database');
    console.log('Connected to the data base');
    const db = client.db('TodoApp');
    let documents;
    (async ()=>{
        try {
          return await db.collection('Todos').find({_id:new ObjectID('5c27bd577437763210808377')}).toArray();
        } catch (error) {
           console.log(error); 
        }
    })().then(d=>console.log(d))
    client.close();
})