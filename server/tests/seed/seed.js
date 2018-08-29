const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/users');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

const userOneID = new ObjectID();
const userTwoID = new ObjectID();
const users = [{
    _id : userOneID,
    email: 'anand.rachit@gmail.com',
    password: 'UserOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneID, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoID,
    email: 'anandrachit1305@gmail.com',
    password: 'UserTwoPass'

}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());

}

const populateUsers = (done) => {
    User.remove({}).then(() => {
       let userOne = new User(users[0]).save();
       let userTwo = new User(users[1]).save();

       return Promise.all([userOne, userTwo]);
    }).then(() => done());
}

module.exports ={ 
    todos,
    populateTodos,
    users, 
    populateUsers
}