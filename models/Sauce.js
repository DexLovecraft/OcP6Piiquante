const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId : {type : 'string', required: true},
    name : {type : 'string', required : true},
    manufacturer : {type : 'string', required : true},
    description : {type : 'string', required : true},
    mainPepper : {type : 'string', required : true},
    imageUrl : {type : 'string', required : true},
    heat : {type : 'number', required : true}, 
    likes : {type : 'number', required : true}, 
    dislikes : {type : 'number', required : true}, 
    usersLiked : {type : 'array', required : true}, 
    usersDisliked : {type : 'array', required : true}
});

module.exports = mongoose.model('Sauce', sauceSchema);