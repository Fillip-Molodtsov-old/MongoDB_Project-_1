const mongoose = require('mongoose');
const validator = require('validator');
const passwordValidator = require('password-validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
                    .is().max(25)                                  // Maximum length 100
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

let User = new mongoose.model('User', UserSchema);

module.exports = { User };