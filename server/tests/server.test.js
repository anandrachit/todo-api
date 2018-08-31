const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/users')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = "Any value you like";
        request(app)
            .post('/todos')
            .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect( (res) => {
                expect(res.body.todos.length).toBe(1)
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should get one todo',(done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect( (res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });

    it('should not get a todo created by other user',(done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 with invalid ID message', (done) => {
        request(app)
            .get('/todos/1234')
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .expect( (res) => {
                expect(res.body.error).toBe('Invalid ID')
            })
            .end(done);
    });

    it('should return 404 message', (done) => {
        request(app)
            .get('/todos/5b739701bdca5405539de114')
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE TODO by ID', () => {
    it('Should return a 200 with one todo deleted', (done) => {
    request(app)
        .delete(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect( (res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('Should not delete todo owned by someone else', (done) => {
    request(app)
        .delete(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('Should return 404 with Invalid ID message', (done) => {
        request(app)
            .delete('/todos/123')
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .expect( (res) => {
                expect(res.body.error).toBe('Invalid ID');
            })
            .end(done);
    });

    it('Should return 400 with ID does not exist error message', (done) => {
        request(app)
            .delete('/todos/6b74edbe501df403da5062d0')
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

    describe('PATCH /todos/:id', () => {
        it('should update the todo', (done) => {
            let hexID = todos[0]._id.toHexString();
            let text = 'This hsould be the new text';

            request(app)
                .patch(`/todos/${hexID}`)
                .set('x-auth',users[0].tokens[0].token)
                .send({
                    completed: true,
                    text
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(text);
                    expect(res.body.todo.completed).toBe(true);
                    // expect(res.body.todo.completedAt).toBeA('number');
                })
                .end(done)
        });

        it('should not update the todo created by a different user', (done) => {
            let hexID = todos[0]._id.toHexString();
            let text = 'This hsould be the new text';

            request(app)
                .patch(`/todos/${hexID}`)
                .set('x-auth',users[1].tokens[0].token)
                .send({
                    completed: true,
                    text
                })
                .expect(404)
                .end(done)
        });

        it('should clear completedAt when todo is not completed', (done) => {
            let hexID = todos[1]._id.toHexString();
            let text = 'This should be some different text';
            request(app)
                .patch(`/todos/${hexID}`)
                .set('x-auth',users[1].tokens[0].token)
                .send({
                  completed: false,
                  text  
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.todo.text).toBe(text);
                    expect(res.body.todo.completed).toBe(false);
                    // expect(res.body.todo.completedAt).toNotExist();
                })
                .end(done);
        })
    })

    describe('GET /users/me', () => {
        it('should return user when authenticated', (done) => {
            request(app)
                .get('/users/me')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect( (res) => {
                    expect(res.body._id).toBe(users[0]._id.toHexString());
                    expect(res.body.email).toBe(users[0].email);
                })
                .end(done);
        });

        it('should return 401 when not authenticated', (done) => {
            request(app)
                .get('/users/me')
                .expect(401)
                .expect((res) => {
                    expect(res.body).toEqual({});
                })
                .end(done);
        });
    });
    describe('POST /users', () => {
        it('Should create a user', (done) => {
            let email = 'example@example.com';
            let password = '123abcd';
            request(app)
                .post('/users')
                .send({email, password})
                .expect(200)
                .expect((res) => {
                    expect(res.header['x-auth']).toBeTruthy();
                    expect(res.body._id).toBeTruthy();
                    expect(res.body.email).toBe(email);
                })
                .end((err) => {
                    if(err){
                        return done(err);
                    }

                    User.findOne({email}).then((user)=> {
                        expect(user).toBeTruthy();
                        expect(user.password).not.toBe(password);
                        done();
                    })
                });
        });

        it('Should return validation errors if request is invalid', (done) => {
            let email = 'abc';
            let password = '123';
            request(app)
                .post('/users')
                .send({email, password})
                .expect(400)
                .end(done);
        });

        it('Should not create user if email in use', (done) => {
            let email = 'anand.rachit@gmail.com';
            let password = 'abc12345';
            request(app)
                .post('/users')
                .send({email, password})
                .expect(400)
                .end(done);
        });
    });

describe('POST /users/login', () => {
    it('Should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[0].email,
                password: users[0].password
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
                })
            .end(done);
    });

    it('Should not login user with invalid credentials', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'crazyPassword'
            })
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                }).catch( e=> done(e));
                done();
            });
    })
});

describe('DELETE /users/me/token', () => {
    it('should remove a token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth',users[0].tokens[0].token )
            .expect(200)
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                }).catch( e => done(e));
                done();
            });
    });
});