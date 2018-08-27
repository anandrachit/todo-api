const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());

});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = "Any value you like";
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => {
                    done(e);
                })
            });
    });

    it('should not create todo with bad body data', (done) => {
        request(app)
            .post('/todos')
            .send()
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e => {
                    done(e);
                });
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect( (res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should get one todo',(done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect( (res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });

    it('should return 404 with invalid ID message', (done) => {
        request(app)
            .get('/todos/1234')
            .expect(404)
            .expect( (res) => {
                expect(res.body.error).toBe('Invalid ID')
            })
            .end(done);
    });

    it('should return 404 message', (done) => {
        request(app)
            .get('/todos/5b739701bdca5405539de114')
            .expect(404)
            .end(done);
    });
});

describe('DELETE TODO by ID', () => {
    it('Should return a 200 with one todo deleted', (done) => {
    request(app)
        .delete(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect( (res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('Should return 404 with Invalid ID message', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .expect( (res) => {
                expect(res.body.error).toBe('Invalid ID');
            })
            .end(done);
    });

    it('Should return 400 with ID does not exist error message', (done) => {
        request(app)
            .delete('/todos/6b74edbe501df403da5062d0')
            .expect(404)
            .expect( (res) => {
                expect(res.body.error).toBe('ID does not exist');
            })
            .end(done);
    });
});

    describe('PATCH /todos/:id', () => {
        it('should update the todo', (done) => {
            let hexID = todos[0]._id.toHexString();
            let text = 'This hsould be the new text';

            request(app)
                .patch(`/todos/${hexID}`)
                .send({
                    completed: true,
                    text
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(text);
                    expect(res.body.todo.completed).toBe(true);
                    expect(res.body.todo.completedAt).toBeA('number');
                })
                .end(done)
        });

        it('should clear completedAt when todo is not completed', (done) => {
            let hexID = todos[1]._id.toHexString();
            let text = 'This should be some different text';
            request(app)
                .patch(`/todos/${hexID}`)
                .send({
                  completed: false,
                  text  
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(text);
                    expect(res.body.todo.completed).toBe(false);
                    expect(res.body.todo.completedAt).toNotExist();
                })
                .end(done);
        })
    })