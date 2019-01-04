
const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');
const {app} = require('../server');
const {Fishnik} = require('../models/fishnik');
const {User} = require('../models/user');
const {dummyFi,createSeedFishnik,users,createSeedUser} = require('./seed/seed');

beforeEach(createSeedUser);
beforeEach(createSeedFishnik);

describe("POST Fishnik",()=>{
    it('should create a new fishnik',(done)=>{
        let name = "name";
        let year = 4;
        let orientation = false;
        request(app)
            .post('/fishnik')
            .send({name,year,orientation})
            .expect(200)
            .expect((res)=>{
                expect(res.body.orientation).toBe(false);
            })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            (async ()=>{
                try{
                    let fishniks = await Fishnik.find({});
                    expect(fishniks.length).toBe(3);
                    expect(fishniks[2].name).toBe(name);
                    done();
                }catch(e){
                    done(e);
                }
            })();
        })
    });
    it('should not create a blank doc',(done)=>{
        request(app)
            .post('/fishnik')
            .send({})
            .expect(400)
            .end((err,res)=>{
                if(err) return done(err);
                (async ()=>{
                    try{
                        let fishniks = await Fishnik.find();
                        expect(fishniks.length).toBe(2);
                        done();
                    }catch(e){
                        done(e);
                    }
                })();
            })
    })
})

describe('GET /Fishnik',()=>{
    it('should return the fishniks array',(done)=>{
        request(app)
            .get('/fishnik')
            .expect(200)
            .expect((res)=>{
                expect(res.body[0].name).toBe(dummyFi[0].name);
            })
            .end(done)
    })
    it('should return a doc by id',(done)=>{
        request(app)
            .get(`/fishnik/${dummyFi[0]._id.toHexString()}`)
            .expect(200)
            .end((err,res)=>{
                if(err) return done(err);
                expect(res.body.name).toBe(dummyFi[0].name);
                done();
            })
    })
})

describe('DELETE /fishnik',()=>{
    it('should delete items by id',(done)=>{
        let id = dummyFi[0]._id.toHexString();
        request(app)
            .delete(`/fishnik/${id}`)
            .expect(200)
            .end((err,res)=>{
                if(err) return done(err);
                Fishnik.findById(id).then((doc)=>{
                    expect(doc).toBeFalsy();
                    done();
                }).catch(e=>done(e));
            })
        
    })
})

describe('PATCH /fishnik/:id',()=>{
    it('should work(the test)',(done)=>{
        let id = dummyFi[0]._id.toHexString();
        let sendingObj = {
            name:'Tupiko',
            year:5
        }
        request(app)
            .patch(`/fishnik/${id}`)
            .send(sendingObj)
            .expect(200)
            .end((err,res)=>{
                if(err) return done(err);
                Fishnik.findById(id).then((doc)=>{
                    expect(doc.name).toBe(sendingObj.name);
                    done();
                }).catch(e=>done(e))
            })
    })
})
describe('GET /users/me',()=>{
    it('should return swoosh if authenticated',(done)=>{
        request(app)
            .get('/user/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .end((err,res)=>{
                if(err) return done(err);
                expect(res.body.email).toBe(users[0].email);
                done();
            })
    })
    it('should fail because don\'t authenticated',(done)=>{
        request(app)
            .get('/user/me')
            .expect(401)
            .end(done)
    })
})

describe('POST /user',()=>{
    it('should return a new user',(done)=>{
        let user = {email:'yuui@ghmdtu.uiyou',password:'jzktySRY456'};
        request(app)
            .post('/user')
            .send(user)
            .expect(200)
            .end((err,res)=>{
                if(err) return done(err);
                expect(res.header['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();

                User.findOne(user).then(()=>done()).catch(e=>done(e))
            })
    });
})