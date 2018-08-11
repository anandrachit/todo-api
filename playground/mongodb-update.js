const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Unable to connect to Mongo DB Server');
    }
    console.log('Connected to Mongo DB server');
    const db = client.db('TodoApp');

    db.collection('Users')
        .findOneAndUpdate({
            _id: new ObjectID('5b6f0908a24aca16fcb429cd')
        },{
            $inc: { age: 1},
            $set: {name: 'Shruti'}
        }, { returnNewDocument : true }).then((result) => {
            console.log(JSON.stringify(result, undefined, 4));
        })

    // client.close();
});