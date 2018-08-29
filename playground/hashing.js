const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hashValue) => {
        console.log(hashValue);
    });
});

let hashedPassword = '$2a$10$EKAUE/5oYg2CYcZ3rovVr.6oS5svd5xcSanSeSvTzIanKok03R8V2';

bcrypt.compare('123a11bc!', hashedPassword, (err, result) => {
        console.log(result)
})
// let data = {
//     id: 10
// }

// let token = jwt.sign(data, '123abc');

// console.log(token);
// let decoded = jwt.verify(token , '123abc');

// console.log('decoded', decoded);
// // let message = 'I am user number 3';

// // let digest = SHA256(message).toString();

// console.log(`Message : ${message}`);
// console.log(`Digest : ${digest}`);

// let data = {
//     id: 4
// };

// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data)+'somesecret').toString()
// }

// // token.data.id= 5;
// // token.hash = SHA256(JSON.stringify(data)).toString();

// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash){
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Dont Trust');
// }