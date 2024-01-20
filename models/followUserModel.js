const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let followUserSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    following_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    followed_on: {
        type: Number,
        default: new Date().getTime()
    },
},{
    strict: true,
    versionKey: false,
    collection: 'follow_user',
    timestamps: false
})

let FollowUserModel = mongoose.model('follow_user', followUserSchema);
module.exports = FollowUserModel;