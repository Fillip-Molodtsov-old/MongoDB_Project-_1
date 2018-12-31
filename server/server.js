const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/MongooseApp', { useNewUrlParser: true });

// let Fishnik = new mongoose.model('Fishnik', {
//     name: {
//         type: String,
//         required: true,
//         trim:true,
//         minlength:1,
//     },
//     year: {
//         type: Number,
//     },
//     orientation: {
//         type: Boolean,
//         required: [function(){
//             return this.year>1;
//         },'Come on, get your orientation']
//     }
// });

// let fresh1 = new Fishnik({
//     name:'Phil',
//     year:4,
//     orientation:true,
// });
// fresh1.save().then((doc) => {
//     console.log(doc);
// }, (e) => {
//     console.log('Error Inserting New Data');
//     if (e.name == 'ValidationError') {
//         for (field in e.errors) {
//             console.log(field);
//             console.log(e.errors[field].message); 
//         }
//     }
// });
let User = new mongoose.model('User',{
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
    }
})

let user0 = new User({email:'1@w.gu'});
user0.save().then(doc=>console.log(doc),
e=>{
    console.log('Issue with saving the data');
    if(e.name =='ValidationError'){
        for(field in e.errors){
            console.log(e.errors[field].message);
        }
    }
})