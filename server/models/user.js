const mongoose = require('mongoose');
const validator = require('validator');
const passwordValidator = require('password-validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        unique: [true, 'Already taken'],
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} isn\'t a valid email',
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                let rules = new passwordValidator();
                rules
                    .is().min(8)                                    // Minimum length 8
                    .is().max(100)                                  // Maximum length 100
                    .has().uppercase()                              // Must have uppercase letters
                    .has().lowercase()                              // Must have lowercase letters
                    .has().digits()                                 // Must have digits
                    .has().not().spaces();                           // Should not have spaces
                let checking = rules.validate(value, { list: true });
                if (checking.length) {
                    let str = "";
                    checking.forEach(el => {
                        switch (el) {
                            case 'min':
                                str += 'The password length has to be min 8\n';
                                break;
                            case 'max':
                                str += 'The password length has to be max 25\n';
                                break;
                            case 'uppercase':
                                str += 'The password has to contain uppercase characters\n';
                                break;
                            case 'lowercase':
                                str += 'The password has to contain lowercase characters\n';
                                break;
                            case 'digits':
                                str += 'The password length has to contain digits\n';
                                break;
                            case 'spaces':
                                str += 'The password length shouldn\'t contain spaces\n';
                                break;
                        }
                    })
                    throw new Error(str);
                }
                return checking;
            },
        }
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.statics.findByEmailPass = function(user){
    if(!("email" in user)) throw new Error('Email parameter not found')
    if(!("password" in user)) throw new Error('Password parameter not found')
    return (async()=>{
        try {
            let doc = await this.findOne({"email":user.email});
            if(!doc)  throw new Error(`User with "${user.email}" not found`);
            let passwordCorrect = await bcrypt.compare(user.password,doc.password);
            if(passwordCorrect) return doc;
            throw new Error('Incorrect password')
        } catch (error) {
            throw error;
        }
    })();
}

UserSchema.statics.findByToken = function(token){
    // this is the context of the  User model
    let decodedID;
    try {
        decodedID = jwt.verify(token,'abc123');
    } catch (error) {
        return Promise.reject();
    }
    return this.findOne({
        _id:decodedID._id,
        'tokens.access':decodedID.access,
        'tokens.token':token
    }).then(doc=>doc)
}

UserSchema.methods.toJSON = function () {
    let user = this;
    let userObj = user.toObject();
    return _.pick(userObj,['email','_id'])
    
}
UserSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
    user.tokens = user.tokens.concat([{ access, token }]);
    return user.save().then(() => token);
}

UserSchema.pre('save',function(next){
    //this is the context of our user's doc
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next(err);
            })
        })
    }else{
        next();
    }
})

let User = new mongoose.model('User', UserSchema);

module.exports = { User };