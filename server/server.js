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

app.listen(port,()=>console.log('listening port'));

module.exports = {app};