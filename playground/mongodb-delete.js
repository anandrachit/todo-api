const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Unable to connect to Mongo DB Server');
    }
    console.log('Connected to Mongo DB server');
    const db = client.db('TodoApp');

    // db.collection('Users').deleteMany({name: 'Rachit'}).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5b6df2eee848b90d23b52a2c')
    }).then((result) => {
        console.log(result);
    })

    // client.close();
});