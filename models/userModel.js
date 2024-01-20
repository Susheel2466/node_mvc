const mongoose  = require('./../config/db');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    first_name: {
        type: String,

    },
    last_name: {
        type: String,

    },
    country_code: {
        type: String,

    },
    mobile_number: {
        type: String,

    },
    email: {
        type: String,

    },
    password: {
        type: String,
    },
    address: {
        type: String,
    },
    access_token: {
        type: String,
    },
    is_blocked: {
        type: Number,
        default: 0 // 1 for block and 0 for unblock
    },
    last_logged_in: {
        type: Number,
        default: new Date().getTime()
    },
    created_on: {
        type: Number,
        default: new Date().getTime()
    },
}, {
    strict: true,
    collection: 'user',
    versionKey: false,
    timestamps: false
});
let UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;
