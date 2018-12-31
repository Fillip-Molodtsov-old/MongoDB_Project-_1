const express = require('express');
const bodyParser = require('body-parser');

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

app.listen(3000);

module.exports = {app};