const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var bookmarkBlogSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        REF: "user"
    },
    blog_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog"
    },
    bookmarked_on: {
        type: Number,
        default: new Date().getTime()
    }
},{
    strict: true,
    collection: "bookmark_blog",
    timestamps: false,
    versionKey: false
})

var BookmarkBlogModel  = mongoose.model('bookmark_blog', bookmarkBlogSchema);
module.exports = BookmarkBlogModel;