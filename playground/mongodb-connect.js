const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Unable to connect to Mongo DB Server');
    }
    console.log('Connected to Mongo DB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (error, res) => {
    //     if (error) {
    //         return console.log('Unable to insert todo', error)
    //     }
    //     console.log(JSON.stringify(res.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Rachit',
    //     age: 36,
    //     location: 'Morgantown'
    // }, (err, res) => {
    //     if(err) {
    //         return ('Unable to insert into Users', err);
    //     }
    //     console.log(res.ops[0]._id.getTimeStamp());
    // })

    client.close();
})