const { Joi } = require('celebrate');

let user = {
   
    REGISTERUSER: Joi.object().keys({
        first_name: Joi.string().required(),
        last_name: Joi.string().optional().allow(''),
        country_code: Joi.string().required(),
        mobile_number: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        address: Joi.string().optional().allow('')
    }),

    ADDBLOG: Joi.object().keys({
        blog_title: Joi.string().required(),
        blog_description: Joi.string().optional().allow('')
    }),

    EDITBLOG: Joi.object().keys({
        _id: Joi.string().required(),
        blog_title: Joi.string().required(),
        blog_description: Joi.string().optional().allow('')
    }),

    LIKEBLOG: Joi.object().keys({
        blog_id: Joi.string().required(),
    }), 

    BLOGLIKEDUSERS: Joi.object().keys({
        blog_id: Joi.string().required(),
    }), 

    FOLLOWUSER: Joi.object().keys({
        user_id: Joi.string().required(),
    }), 

    BOOKMARKBLOG: Joi.object().keys({
        blog_id: Joi.string().required(),
    }), 

    DELETEBLOG:  Joi.object().keys({
        blog_id: Joi.string().required(),
    }), 

    VIEWBLOG: Joi.object().keys({
        blog_id: Joi.string().required(),
    }), 

    BLOGVIEWCOUNT: Joi.object().keys({
        blog_id: Joi.string().required(),
    }), 

    LOGINUSER: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
}

module.exports = user