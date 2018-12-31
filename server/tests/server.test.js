const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Fishnik} = require('../models/fishnik');

beforeEach((done)=>{
    Fishnik.deleteMany().then(()=>done());
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
                    expect(fishniks.length).toBe(1);
                    expect(fishniks[0].name).toBe(name);
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
                        let fishniks = Fishnik.find();
                        expect(fishniks.length).toBe(undefined);
                        done();
                    }catch(e){
                        done(e);
                    }
                })();
            })
    })
})