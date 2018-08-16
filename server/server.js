const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {Users} = require('./models/users');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let toDo = new Todo({
        text: req.body.text,
    });
    toDo.save().then((doc) => {
        res.send(doc);  
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo
        .find()
        .then( (todos) => {
            res.send({todos})
        }, (e) => {
            res.status(400).send(e);
        });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if ( !ObjectID.isValid(id)) {
        res.status(404).send('Invalid ID');
    } else {
        Todo   
            .findById(id)
            .then((todo) => {
                if(todo){
                    res.status(200).send({todo})
                } else {
                    res.status(404).send();
                }

                
            }, (e) => {
                res.status(400).send();
            });
    }
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};