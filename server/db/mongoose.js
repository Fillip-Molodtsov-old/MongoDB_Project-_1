const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/MongooseApp', { useNewUrlParser: true });

module.exports ={mongoose};