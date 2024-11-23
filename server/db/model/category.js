const mongoose =  require('mongoose');

let category_Schema = new mongoose.Schema({
    category : {
        type : String
    }
})

 module.exports = mongoose.model('category',category_Schema)