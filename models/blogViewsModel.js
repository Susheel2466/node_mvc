const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var blogViewsSchema = new Schema({
    viewer_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    blog_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog"
    },
    bloger_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    viewed_on: {
        type: Number,
        default: new Date().getTime()
    }
},
{
    strict: true,
    collection: "blog_views",
    timestamps: false,
    versionKey: false
})

const BlogViewsModel = mongoose.model('blog_views', blogViewsSchema);
module.exports = BlogViewsModel;