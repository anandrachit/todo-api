const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');

let id = '5b739701bdca5405539de11311';

if(!ObjectID.isValid(id)){
    console.log('ID is not valid');
} else{
    console.log('ID is valid');
}

// Todo.find({_id: id})
//     .then((todos) => {
//         console.log(todos);
//     });

// Todo.findOne({completed: false})
//     .then((todo) => {
//         console.log(todo);
//     })

// Todo.findById(id).then((todo) => {
//     console.log(todo);
// })