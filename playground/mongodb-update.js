const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err) return console.log('Error with connecting to the database');
    console.log('Connected to the data base');
    const db = client.db('TodoApp');
    (async ()=>{
        let doc = await db.collection('Users').findOneAndUpdate({
            _id: new ObjectID('5c27bffbbca7293d48cd11fb')
        },
        {
            $set:{
                name:'Jake'
            },
            $inc:{
                age:-1
            }
        },{
            returnNewDocument:true,
            returnOriginal:false,
        });
        console.log(doc);
    })();
    client.close();
})