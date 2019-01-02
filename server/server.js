const _ = require('lodash')
const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Fishnik} = require('./models/fishnik');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/fishnik',(req,res)=>{
    let fishnik = new Fishnik({
        name:req.body.name,
        year:req.body.year,
        orientation:req.body.orientation,
    });
    fishnik.save().then((doc)=>{
        res.send(doc);
    },e=>{
        console.log('Getting error with adding new document');
        if(e.name = "ValidationError"){
            for(field in e.errors){
                res.status(400).send(e.errors[field].message);
            }
        }
    })
})

app.get('/fishnik',(req,res)=>{
    let parameters = req.query;
    
    //uri example /fishnik?name=phil&year=6
    if(parameters){
        return Fishnik.find(parameters).then((docs)=>{
            if(docs!=0) return res.send(docs);
            res.send('Nothing found');
        }).catch((e)=>res.send(e))
    }
    
    (async ()=>{
        try{
           let fishniks = await Fishnik.find();
           if(fishniks == 0){
               res.send({code:'The fishniks array is empty'})
           }
           res.send({
               fishniks
            })
        }catch(e){
            res.status(404).send(e);
        }
    })();
})

app.get('/fishnik/:id',(req,res)=>{
    let {id} = req.params;
    if(ObjectID.isValid(id)){
        (async ()=>{
            try {
                let doc = await Fishnik.findById(id);
                if(doc) return res.send(doc);
                throw new Error('blank')
            } catch (error) {
                console.log(error);
                res.status(404).send(error);
            }
        })();
    }else{
        let error = 'Invalid ID';
        console.log(error);
        res.status(404).send(error);
    }
})


app.delete('/fishnik/:id',(req,res)=>{
    let {id} = req.params;
    if(ObjectID.isValid(id)){
        (async ()=>{
            try{
                let doc = await Fishnik.findByIdAndDelete(id);
                if(doc) return res.send(doc);
                throw new Error('Not found');   
            }catch(error){
                res.status(404).send(error.message);
            }          
        })();   
    }else{
        res.send('Invalid ID');
    }
})

app.delete('/fishnik',(req,res)=>{
    let parameters = req.query;
    if(!Object.keys(parameters).length)  return res.status(404).send('No parameters');
    (async ()=>{
        try {
            let docs = await Fishnik.deleteMany(parameters);
            if(docs.n>0) return res.send(docs);
            throw new Error('Nothing found')
        } catch (error) {
            res.status(418).send(error.message)
        }
    })();
})

app.patch('/fishnik/:id',(req,res)=>{
    let {id} = req.params;
    let updateObj = _.pick(req.body,['name','year','orientation']);
    if(!ObjectID.isValid(id)){
       return res.status(404).send('Invalid ID')
    }
    if(!Object.keys(updateObj).length) return res.send('You can\'t update that parametres');

    (async ()=>{
        try {
            let doc = await Fishnik.findByIdAndUpdate(id,updateObj,{new:true});
            if(!Object.keys(doc).length) throw new Error('Blank object')
            res.send(doc);
        } catch (error) {
            res.status(404).send(error);
        }
         
    })();
})

app.listen(port,()=>console.log('listening port'));

module.exports = {app};