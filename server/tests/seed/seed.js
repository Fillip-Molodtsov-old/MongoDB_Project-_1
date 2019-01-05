const jwt = require('jsonwebtoken');

const {ObjectID} = require('mongodb');
const {Fishnik} = require('../../models/fishnik');
const {User} = require('../../models/user');

const user1ID = new ObjectID();
const user2ID = new ObjectID();

const users = [{
    _id:user1ID,
    email:'gugu@gaga.com',
    password:'yuYTR655654',
    tokens:[{
        access:'auth',
        token:jwt.sign({_id:user1ID,access:'auth'},'abc123').toString()
    }]
},{
    _id:user2ID,
    email:'gigi@gege.yup',
    password:'trTTT46534',
    tokens:[{
        access:'auth',
        token:jwt.sign({_id:user2ID,access:'auth'},'abc123').toString()
    }]
}]

const dummyFi = [{
    _id:new ObjectID(),
    _creator:user1ID,
    name:'stoopid',
    year:1,
    orientation:true,
},{ 
    _id:new ObjectID(),
    _creator:user2ID,
    name:'jake',
    year:4,
    orientation:true,
}];

const createSeedFishnik = (done)=>{
    Fishnik.deleteMany().then(()=>Fishnik.insertMany(dummyFi)).then(()=>done());
};
const createSeedUser = (done)=>{
    User.deleteMany().then(()=>{
        let user1 = new User(users[0]).save();
        let user2 = new User(users[1]).save();
        return Promise.all([user1,user2]).then(()=>done())
    })
}
module.exports = {
    dummyFi,
    createSeedFishnik,
    users,
    createSeedUser,
}