const _ = require('lodash')
const express = require('express');
const bodyParser = require('body-parser');

let config = require('./config/config-env')
const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {authenticate} = require('./middleware/authenticate');
const {User} = require('./models/user');
const {Fishnik} = require('./models/fishnik');

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

const postingErrorHandler =(e,res)=>{
    console.log('Getting error with adding new document');
    if(e.name == "ValidationError"){
        for(field in e.errors){
            res.status(400).send(e.errors[field].message);
        }
    }else if(e.code ==11000){
        res.status(400).send("Email already taken")
    }
}
app.post('/fishnik',authenticate,(req,res)=>{
    let fishnik = new Fishnik({
        name:req.body.name,
        year:req.body.year,
        orientation:req.body.orientation,
        _creator:req.doc._id,
    });
    fishnik.save().then((doc)=>{
        res.send(doc);
    },e=>{
        postingErrorHandler(e,res)
    })
})


app.get('/fishnik',authenticate,(req,res)=>{
    let parameters = req.query;
    parameters._creator = req.doc._id;
    //uri example /fishnik?name=phil&year=6
    return Fishnik.find(parameters)
            .then((docs)=>{
                if(docs!=0) return res.send(docs);
                res.send('Nothing found');
            })
            .catch((e)=>res.send(e))
    
    // (async ()=>{
    //     try{
    //        let fishniks = await Fishnik.find();
    //        if(fishniks == 0){
    //            res.send({code:'The fishniks array is empty'})
    //        }
    //        res.send({
    //            fishniks
    //         })
    //     }catch(e){
    //         res.status(404).send(e);
    //     }
    // })();
})

app.get('/fishnik/:id',authenticate,(req,res)=>{
    let {id} = req.params;
    let _creator = req.doc._id;
    if(ObjectID.isValid(id)){
        (async ()=>{
            try {
                let doc = await Fishnik.findOne({_id: id,_creator});
                if(doc) return res.send(doc);

                throw new Error('blank')
            } catch (error) {
                res.status(404).send(error.message);
            }
        })();
    }else{
        let error = 'Invalid ID';
        console.log(error);
        res.status(404).send(error);
    }
})


app.delete('/fishnik/:id',authenticate,(req,res)=>{
    let {id} = req.params;
    let _creator = req.doc._id;
    if(ObjectID.isValid(id)){
        (async ()=>{
            try{
                let doc = await Fishnik.findOneAndDelete({_id:id,_creator});
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

app.patch('/fishnik/:id',authenticate,(req,res)=>{
    let {id} = req.params;
    let _creator = req.doc._id;
    let updateObj = _.pick(req.body,['name','year','orientation']);
    if(!ObjectID.isValid(id)){
       return res.status(404).send('Invalid ID')
    }
    if(!Object.keys(updateObj).length) return res.send('You can\'t update that parametres');

    (async ()=>{
        try {
            let doc = await Fishnik.findOneAndUpdate({_id:id,_creator},updateObj,{new:true});
            if(!Object.keys(doc).length) throw new Error('Blank object')
            res.send(doc);
        } catch (error) {
            res.status(404).send(error);
        }
         
    })();
})

app.post('/user',(req,res)=>{
    let uploadingObj = _.pick(req.body,['email','password']);
    let user = new User(uploadingObj);
    user.save().then(()=>{
        return user.generateAuthToken()
    }).then((token)=>{
        res.header('x-auth',token).send(user);
    }).catch((e)=>{
        postingErrorHandler(e,res)
    })
})

app.get('/user/me',authenticate,(req,res)=>{
    res.send(req.doc)
})

app.get('/user/login',(req,res)=>{
    let user = _.pick(req.body,['email','password']);
    User.findByEmailPass(user).then((doc)=>{
        return doc.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user);
        })
    }).catch((e)=>{
        res.status(418).send(e.message)
    })
})

app.delete('/user/logout',authenticate,(req,res)=>{
    let token = req.token;
    req.doc.removeToken(token)
    .then(()=>res.status(200).send('Succesfully logged out'))
    .catch(e=>res.send(e.message))
})

app.listen(port,()=>console.log(`listening ${port}`));

module.exports = {app};