 const {ObjectID} = require('mongodb');

 const {mongoose} = require('../server/db/mongoose');
 const {Fishnik} = require('../server/models/fishnik');

const _id = '5c2b57acbeaa7c66982e965d';
if(ObjectID.isValid(_id)){
    Fishnik.findById(_id)
        .then((res)=>{
            if(!res){
                return console.log('There is no document with that ID');
            }
            console.log(res);
        })
        .catch((e)=>console.log(e))
}else{
    console.log('error');
}