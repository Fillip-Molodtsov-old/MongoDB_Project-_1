const mongoose = require('mongoose');

let mongoDBURI1 = 'mongodb://localhost:27017/MongooseApp';
let mongoDBURI2 = 'mongodb://philvm:philvm123@ds145194.mlab.com:45194/fishnik';
let mongodb_uri = process.env.MONGODB_URI?mongoDBURI2:mongoDBURI1;
mongoose.connect(mongoDBURI2, { useNewUrlParser: true });

module.exports ={mongoose};