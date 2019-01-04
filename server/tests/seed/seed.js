const jwt = require('jsonwebtoken');

const {ObjectID} = require('mongodb');
const {Fishnik} = require('../../models/fishnik');
const {User} = require('../../models/user');

const dummyFi = [{
    _id:new ObjectID(),
    name:'stoopid',
    year:1,
    orientation:true,
},{ 
    _id:new ObjectID(),
    name:'jake',
    year:4,
    orientation:true,
}];

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
}]

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