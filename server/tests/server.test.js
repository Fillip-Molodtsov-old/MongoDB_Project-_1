const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');
const {app} = require('../server');
const {Fishnik} = require('../models/fishnik');

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
}]

beforeEach((done)=>{
    Fishnik.deleteMany().then(()=>Fishnik.insertMany(dummyFi)).then(()=>done());
})

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
                expect(res.body.fishniks[0].name).toBe(dummyFi[0].name);
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