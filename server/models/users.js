const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

let User = mongoose.model('Users',UserScehma);

module.exports = {User};