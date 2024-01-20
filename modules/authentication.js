const jwt = require('jsonwebtoken');
const config = require('./../config/config');
const UserModel = require('./../models/userModel');

exports.verifyUserToken = async (req, res, next) => {
    try{
        let { access_token } = req.headers;
        if(!access_token){
           return res.status(401).send({
                auth: false,
                message: 'No token provided'
           })
        }
        jwt.verify(access_token, config.JWT_PRIVATE_KEY, async function(err, decoded){
            if(!err){
                let user = await UserModel.findOne({ access_token: access_token }).lean();
                if(!user){
                    return res.status(401).send({ message: 'Invalid access token' });
                }else{
                    req.userData = user;
                    next();
                }
            }else{
                return res.status(402).json({
                    auth: false,
                    message: 'Token expired'
               })
            }
        })
    } catch(err) {
        throw new err;
    }
}

exports.generateToken = () => {
    const token = jwt.sign({ access: 'access-'}, config.JWT_PRIVATE_KEY ,{ expiresIn: '2 days' });
    return token;
}