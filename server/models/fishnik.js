const mongoose = require('mongoose');

let Fishnik = new mongoose.model('Fishnik', {
    name: {
        type: String,
        required: true,
        trim:true,
        minlength:1,
    },
    year: {
        type: Number,
    },
    orientation: {
        type: Boolean,
        required: [function(){
            return this.year>1;
        },'Come on, get your orientation']
    }
});

module.exports = {Fishnik};