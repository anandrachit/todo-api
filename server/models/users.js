const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let UserScehma = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
        message: '{value} is not a valid email' 
        }
    },
    password: {
        type: String,
        require: true,
        minLength: 6
    },
    tokens :[{
        access: {
            type: String, 
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

UserScehma.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

UserScehma.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id: user._id.toHexString(), access},'abc123').toString();

    user.tokens.push({
        access,
        token
    });

    return user.save().then(() => {
        return token;
    })
}

UserScehma.methods.removeToken = function(token) {
    let user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

UserScehma.statics.findByToken = function (token) {
    let User = this;
    let decoded = undefined;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

UserScehma.statics.findByCredentials = function (email, password) {
    let User = this;

    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if(err){
                    reject();
                }
                if(!result){
                    reject();
                }
                resolve(user);
            })
        })
    })

};


UserScehma.pre ('save', function (next) {
    let user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hashValue) => {
                user.password = hashValue;
                next();
            })
        })
    } else {
        next();
    }
})

let User = mongoose.model('Users',UserScehma);

module.exports = {User};