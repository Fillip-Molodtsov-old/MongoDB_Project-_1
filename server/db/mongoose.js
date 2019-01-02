const mongoose = require('mongoose');

let mongoDBURI1 = 'mongodb://localhost:27017/MongooseApp';
let mongoDBURI2 = 'mongodb://phil:phil123@ds145194.mlab.com:45194/fishnik';
//you can find the difference between heroku and local app by the port
mongoose.connect(process.env.PORT ? mongoDBURI2 : mongoDBURI1, { useNewUrlParser: true });
mongoose.set('useFindAndModify',false);

module.exports = { mongoose };