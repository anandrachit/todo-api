const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {Users} = require('./models/users');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log(req.body)
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
        })
})

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};