const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let blogSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    blog_title: {
        type: String,
        default: "",
    },
    blog_description: {
        type: String,
        default: "",
    },
    created_on: {
        type: Number,
        default: new Date().getTime()
    },
    modified_on: {
        type: Number,
        default: new Date().getTime()
    },
},{
    strict: true,
    versionKey: false,
    collection: 'blog',
    timestamps: false
})

let BlogModel = mongoose.model('blog', blogSchema);
module.exports = BlogModel;