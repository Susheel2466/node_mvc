const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let likeBlogSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    blog_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog"
    },
    liked_on: {
        type: Number,
        default: new Date().getTime()
    },
},{
    strict: true,
    versionKey: false,
    collection: 'like_blog',
    timestamps: false
})

let LikeBlogModel = mongoose.model('like_blog', likeBlogSchema);
module.exports = LikeBlogModel;