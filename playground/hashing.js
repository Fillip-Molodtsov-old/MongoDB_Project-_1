// const {SHA256} = require('crypto-js');

// console.log("i mma got ghjy");
// console.log(SHA256('i mma got ghjy').toString());

// let data = {
//     id:9,
// }

// let token = {
//     data,
//     hash:SHA256(JSON.stringify(data)+'salting').toString,
// }

const jwt = require('jsonwebtoken');

let token = jwt.sign({id:7},'opo546457b4');
console.log(token);
let data = jwt.verify(token,'opo546457b4');
console.log(data);