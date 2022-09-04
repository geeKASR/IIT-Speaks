const mongoose = require('mongoose');
const {Schema} = mongoose;

const PostSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        required : true
    },
    heading : {
        type : String,
        required : true,
    },
    text : {
        type : String,
        required : true
    },
    image : {
        type : String
    },
    name : {
        type : String,
        required : true
    },
    avatar : {
        type : String,
        required : true
    },
    likes : [
        {
            user : {
                type : Schema.Types.ObjectId,
                required : true,
            }
        }
    ],
    dislikes : [
        {
            user : {
                type : Schema.Types.ObjectId,
                required : true,
            }
        }
    ],
    comments : [
        {
            user : {
                type : Schema.Types.ObjectId,
                required : true,
            },
            text : {
                type : String,
                required : true,
            },
            name : {
                type : String,
            },
            avatar : {
                type : String,
            },
            date : {
                type : Date,
            },
        }
    ],
    date : {
        type : Date,
    },
})

module.exports = mongoose.model('post',PostSchema);