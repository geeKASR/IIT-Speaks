const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.Object,
        ref : 'user'
    },
    department : {
        type : String,
        required : true,
    },
    year : {    
        type : Number,
        required : true,
    },
    location : {
        type : String,
    },
    clubs : {
        type : [String],
    },
    bio : {
        type : String,
    }

})

module.exports = Profile = mongoose.model('profile',ProfileSchema);