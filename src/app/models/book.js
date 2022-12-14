const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;
 const User = require('./user')
const Comment = require('./comment')

mongoose.plugin(slug);

const Book = new Schema({
    name: {type: String, required: true},
    author: String,
    description: String,
    img: String,
    slug:{ type: String, slug: "name", unique: true },
    introduce: String,
    UserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    declaim:[{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }] ,
   
},{ usePushEach: true}
, {
    timestamps: true,
});



module.exports = mongoose.model('Book', Book);
