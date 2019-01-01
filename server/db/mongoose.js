const mongoose = require('mongoose');

let mongoDBURI1 = 'mongodb://localhost:27017/MongooseApp';
let mongoDBURI2 = 'mongodb://phil:phil123@ds145194.mlab.com:45194/fishnik';
mongoose.connect(process.env.MONGODB_PORT?mongoDBURI2:mongoDBURI1, { useNewUrlParser: true });

module.exports ={mongoose};