const modules = require('./../modules/authentication')
const UserModel = require('./../models/userModel');
const BlogModel = require('./../models/blogModel');
const LikeBlogModel = require('./../models/likeBlogModel');
const FollowUserModel = require('./../models/followUserModel');
const BookmarkBlogModel = require('./../models/bookmarkBlogModel');
const BlogViewsModel = require('./../models/blogViewsModel');

const bcrypt  = require('bcrypt');

exports.signupUser = async (req, res) => {
    try {
        let {
            first_name,
            last_name,
            email,
            country_code,
            mobile_number,
            password,
            address
        } = req.body;

        var saltRounds = 10;

        var hash = await bcrypt.hashSync(password, saltRounds);

        let check_user = await UserModel.findOne({

            $or: [{
                email
            }, {
                country_code: country_code.trim(),
                mobile_number: mobile_number.trim()
            }]
        });

        if (check_user) {
            res.status(409).json({
                status_code: 409,
                message: "Email or mobile number already exist"
            })
        } else {
            var gen_token = modules.generateToken();
            
            let data_to_save = {
                first_name,
                last_name,
                email,
                country_code: country_code.trim(),
                mobile_number: mobile_number.trim(),
                password: hash,
                access_token: gen_token,
                address: address,
                created_on: new Date().getTime()
            
            }

            let save_user = await UserModel.create(data_to_save)
            save_user.save();
            if (save_user) {
                res.status(200).json({
                    status_code: 200,
                    message: "User registered successfully",
                    response: save_user
                })
            } else {
                res.status(403).json({
                    status_code: 403,
                    message: "Unable to save data"
                })
            }
        }
    } catch (error) {
        res.status(403).json({
            status_code: 403,
            message: error.message
        })
    }
}

exports.addBlog = async (req, res) => {
    try{
        let { blog_title, blog_description } = req.body;
        let check_blog = await BlogModel.findOne({ blog_title: blog_title }).lean();

        if (check_blog) {
            res.status(409).json({
                status_code: 409,
                message: "Blog already exist"
            })
        } else {            
            let data_to_save = {
                user_id: req.userData._id,
                blog_title,
                blog_description,
                created_on: new Date().getTime()
            
            }

            let save_blog = await BlogModel.create(data_to_save)
            save_blog.save();
            if (save_blog) {
                res.status(200).json({
                    status_code: 200,
                    message: "Blog added successfully",
                    response: save_blog
                })
            } else {
                res.status(403).json({
                    status_code: 403,
                    message: "Unable to save data"
                })
            }
        }
    }catch (error){
        res.status(403).json({
            status_code:403,
            message: error.message
        })
    }
}

exports.editBlog = async (req, res) => {
    try{
        let { _id, blog_title, blog_description } = req.body;
        let check_blog = await BlogModel.findOne({ _id: _id }).lean();

        if (!check_blog) {
            res.status(409).json({
                status_code: 403,
                message: "Blog does not exist"
            })
        } else {            
            let data_to_update = {
                blog_title,
                blog_description,
                modified_on: new Date().getTime()
            }

            // * If upsert is true then if the row trying to be updated does not exist then a new row is inserted instead , if false then it does not do anything.
            // * If new is true then the modified document is returned after the update rather than the original , if false then the original document is returned.

            let update_blog = await BlogModel.findOneAndUpdate({ _id: _id }, { $set: data_to_update }, { new: true, upsert:true }).populate('user_id', 'first_name last_name country_code mobile_number email address').lean();
            if (update_blog) {
                res.status(200).json({
                    status_code: 200,
                    message: "Blog updated successfully",
                    response: update_blog
                })
            } else {
                res.status(403).json({
                    status_code: 403,
                    message: "Unable to update blog"
                })
            }
        }
    }catch (error){
        res.status(403).json({
            status_code:403,
            message: error.message
        })
    }
}

exports.getBlogList = async (req, res) => {
    try{
        let id = req.userData._id;
        if (!id || id == "") {
            res.status(403).json({
                status_code: 403,
                message: "Please login to get blog list"
            })
        }
        let blog_list = await BlogModel.find({ user_id: id },{ user_id: 0, created_on: 0, modified_on: 0 }).lean();

        if (!blog_list) {
            res.status(409).json({
                status_code: 403,
                message: "Unable to find blog list"
            })
        } else {            
            res.status(200).json({
                status_code: 200,
                message: "Blog list fetched successfully",
                response: blog_list
            })
        }
    }catch (error){
        res.status(403).json({
            status_code:403,
            message: error.message
        })
    }
}

exports.likeBlog = async (req, res) => {
    try{
        let { blog_id } = req.body;
        let check_blog = await LikeBlogModel.findOne({ user_id: req.userData._id, blog_id: blog_id }).lean();

        if (check_blog) {
            res.status(409).json({
                status_code: 403,
                message: "You have already liked this blog"
            })
        } else {            
            let data_to_save = {
                user_id: req.userData._id,
                blog_id: blog_id,
                liked_on: new Date().getTime()
            }

            let save_blog = await LikeBlogModel.create(data_to_save)
            save_blog.save();
            if (save_blog) {
                res.status(200).json({
                    status_code: 200,
                    message: "Blog liked successfully",
                })
            } else {
                res.status(403).json({
                    status_code: 403,
                    message: "Unable to save data"
                })
            }
        }
    }catch (error){
        res.status(403).json({
            status_code:403,
            message: error.message
        })
    }
}

exports.blogLikedUsers = async (req, res) => {
    try{
        let id = req.userData._id;
        let  { blog_id } = req.body;

        if (!id || id == "") {
            res.status(403).json({
                status_code: 403,
                message: "Please login to get user list"
            })
        }
        let user_list = await LikeBlogModel.find({ blog_id: blog_id },{ blog_id: 0 }).populate('user_id', 'first_name last_name country_code mobile_number email address').lean();

        if (!user_list) {
            res.status(409).json({
                status_code: 403,
                message: "Unable to find user list"
            })
        } else {            
            res.status(200).json({
                status_code: 200,
                message: "Blog liked user list fetched successfully",
                response: user_list
            })
        }
    }catch (error){
        res.status(403).json({
            status_code:403,
            message: error.message
        })
    }
}

exports.followUser = async (req, res) => {
    try{
        let { user_id } = req.body;
        let check_follow = await FollowUserModel.findOne({ user_id: req.userData._id, following_user_id: user_id }).lean();

        if (check_follow) {
            let unfollow = await FollowUserModel.deleteOne({ _id: check_follow._id }).lean();
            if(unfollow){
                res.status(200).json({
                    status_code: 200,
                    message: "User unfollowed successfully",
                })
            }else{
                res.status(403).json({
                    status_code: 403,
                    message: "Something went wrong, please try again"
                })
            }
        } else {            
            let data_to_save = {
                user_id: req.userData._id,
                following_user_id: user_id,
                followed_on: new Date().getTime()
            }

            let save_follow = await FollowUserModel.create(data_to_save)
            save_follow.save();
            if (save_follow) {
                res.status(200).json({
                    status_code: 200,
                    message: "User followed successfully",
                })
            } else {
                res.status(403).json({
                    status_code: 403,
                    message: "Unable to save data"
                })
            }
        }
    }catch (error){
        res.status(403).json({
            status_code:403,
            message: error.message
        })
    }
}

exports.blogPostedUsers = async (req, res) => {
    try{
        let users = await BlogModel.aggregate([
            {
                $lookup:{
                    from: "user",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "users"
                }
            },
            { "$unwind": "$users" },
            {
                $lookup:{
                    from: "like_blog",
                    let: {
                        blogId: "$_id"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: [ "$blog_id", "$$blogId" ]
                                }
                            }
                        }
                    ],
                    as: "likedUsers"
                }
            },
            {
                $lookup: {
                    from: "follow_user",
                    localField: "user_id",
                    foreignField: "user_id",
                    as: "following"
                }
            },
            {
                $project: {
                    "user_id": "$user_id",
                    "blog_title": "$blog_title",
                    "blog_description": "$blog_description",
                    "blog_creation_date": "$created_on",
                    "user_first_name": "$users.first_name",
                    "user_last_name": "$users.last_name",
                    "user_email": "$users.email",
                    "user_country_code": "$users.country_code",
                    "user_mobile_number": "$users.mobile_number",
                    "user_address": "$users.address",
                    "total_following": "$following",
                    "following_count": {$size:"$following"},
                    "total_likes": "$likedUsers",
                    "like_counts": { $size: "$likedUsers" }
                }
            }
        ])

        if (users) {
            res.status(200).json({
                status_code: 200,
                message: "User list fetched successfully",
                response: users
            })
        } else {
            res.status(403).json({
                status_code: 403,
                message: "Unable to fetch data"
            })
        }
    }catch (error){
        res.status(403).json({
            status_code:403,
            message: error.message
        })
    }
}

exports.resetPasswordFoAllUsers = async (req, res) => {
    try{
        var saltRounds = 10;
        var hash = await bcrypt.hashSync("12345678", saltRounds);
        let updatePass = await UserModel.updateMany({},{ $set: { password: hash } },{ multi: true })
            
        if(updatePass){
            res.status(200).json({
                status_code: 200,
                message: "Password updated successfully",
            })
        }else{
            res.status(403).json({
                status_code: 403,
                message: "Unable to update data"
            })
        }
    }catch (error){
        res.status(403).json({
            status_code:403,
            message: error.message
        })
    }
}

exports.bookmarkBlog = async (req, res) => {
    try{
        let { blog_id } = req.body;

        let isBookmarked = await BookmarkBlogModel.findOne({ user_id: req.userData._id, blog_id: blog_id }).lean();
        if(isBookmarked){
            let deleteBookmark = await BookmarkBlogModel.deleteOne({ _id: isBookmarked._id });
            if(deleteBookmark){
                res.status(200).json({
                    status_code: 200,
                    message: "Blog removed from bookmark successfully",
                })
            }else{
                res.status(403).json({
                    status_code: 403,
                    message: "Something went wrong, please try again"
                })
            }
        }else{
            let data_to_save = {
                user_id: req.userData._id,
                blog_id: blog_id,
                bookmarked_on: new Date().getTime()
            }
            let save_bookmark = await BookmarkBlogModel.create(data_to_save)
            save_bookmark.save();
            if (save_bookmark) {
                res.status(200).json({
                    status_code: 200,
                    message: "Blog bookmarked successfully",
                })
            } else {
                res.status(403).json({
                    status_code: 403,
                    message: "Unable to save data"
                })
            }
        }
    } catch (error) {
        res.status(403).json({
            status_code: 403,
            message: error.message
        })
    }
}

exports.getUserList = async (req, res) => {
    try{
        let getUsers = await UserModel.find({},{ password:0, access_token: 0 }).lean();
            
        if(getUsers){
            res.status(200).json({
                status_code: 200,
                message: "User list fetched successfully",
                response: getUsers
            })
        }else{
            res.status(403).json({
                status_code: 403,
                message: "Unable to get data"
            })
        }
    }catch (error){
        res.status(403).json({
            status_code:403,
            message: error.message
        })
    }
}

exports.myBookmarkedBlogs = async (req, res) => {
    try{
        let getBlogs = await BookmarkBlogModel.find({},{ user_id:0 }).populate('blog_id', 'blog_title blog_description created_on').lean();
            
        if(getBlogs){
            res.status(200).json({
                status_code: 200,
                message: "Bookmarked blog list fetched successfully",
                response: getBlogs
            })
        }else{
            res.status(403).json({
                status_code: 403,
                message: "Unable to get data"
            })
        }
    }catch (error){
        res.status(403).json({
            status_code:403,
            message: error.message
        })
    }
}

exports.deleteBlog = async (req, res) => {
    try{
        let { blog_id } = req.body;

        let isBlogExists = await BlogModel.findOne({ _id: blog_id }).lean();
        if(isBlogExists){
            let deleteBlog = await BlogModel.deleteOne({ _id: isBlogExists._id });
            if(deleteBlog){
                res.status(200).json({
                    status_code: 200,
                    message: "Blog deleted successfully",
                })
            }else{
                res.status(403).json({
                    status_code: 403,
                    message: "Something went wrong, please try again"
                })
            }
        }else{
            res.status(403).json({
                status_code: 403,
                message: "Blog does not exists"
            })
        }
    } catch (error) {
        res.status(403).json({
            status_code: 403,
            message: error.message
        })
    }
}

exports.viewBlog = async (req, res) => {
    try{
        let { blog_id } = req.body;

        let isBlogViewed = await BlogViewsModel.findOne({ user_id: req.userData._id, blog_id: blog_id }).lean();
        if(isBlogViewed){
            let updateBlog = await BlogViewsModel.findOneAndUpdate({ _id: isBlogViewed._id },{ $set: { viewed_on: new Date().getTime() } },{ new: true, upsert: true });
            if(updateBlog){
                res.status(200).json({
                    status_code: 200,
                    message: "Blog viewed successfully",
                })
            }else{
                res.status(403).json({
                    status_code: 403,
                    message: "Something went wrong, please try again"
                })
            }
        }else{
            let blogData = await BlogModel.findOne({ _id : blog_id }).lean();
            let data_to_save = {
                viewer_user_id: req.userData._id,
                blog_id: blog_id,
                bloger_user_id: blogData.user_id,
                viewed_on: new Date().getTime()
            }
            let save_blog_view = await BlogViewsModel.create(data_to_save)
            save_blog_view.save();
            if (save_blog_view) {
                res.status(200).json({
                    status_code: 200,
                    message: "Blog viewed successfully",
                })
            } else {
                res.status(403).json({
                    status_code: 403,
                    message: "Unable to save data"
                })
            }
        }
    } catch (error) {
        res.status(403).json({
            status_code: 403,
            message: error.message
        })
    }
}

exports.blogViewCount = async (req, res) => {
    try{
        let { blog_id } = req.body;

        let blogViewCount = await BlogViewsModel.countDocuments({ bloger_user_id: req.userData._id, blog_id: blog_id }).lean();
        if(blogViewCount){
                res.status(200).json({
                    status_code: 200,
                    message: "Blog viewed count fetched successfully",
                    blogViewCount: blogViewCount
                })    
        }else{
            res.status(403).json({
                status_code: 403,
                message: "Unable to find blog count"
            })
        }
    } catch (error) {
        res.status(403).json({
            status_code: 403,
            message: error.message
        })
    }
}

exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        var check_credenetials

        if (email) {
            check_credenetials = await UserModel.findOne({ email }, {}, { lean: true });
            if (!check_credenetials) throw new Error("Email is not registered with us!")

            let check_password = await bcrypt.compare(password, check_credenetials.password)
            if (check_password) {
                var gen_token = modules.generateToken();

                let updateData = {
                    last_logged_in: new Date().getTime(),
                    access_token: gen_token,
                }
                var update_user = await UserModel.findOneAndUpdate({
                    email: email,
                }, {
                    $set: updateData
                }, {
                    new: true
                })

                if (update_user) {
                    return res.status(200).json({
                        status_code: 200,
                        message: "user logged in successfully",
                        response: update_user
                    })
                } else {
                    throw new Error("Something went wrong")
                }
            } else {
                throw new Error('Password is incorrect')
            }
        }
    } catch (error) {
        res.status(403).json({
            status_code: 403,
            message: error.message
        })
    }
}

exports.myBlogAndFollowingList = async (req, res) => {
    try {
        let getData = await UserModel.aggregate([
            {
                $lookup:{
                    from: "blog",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "myBlogs"
                }
            },
            {
                $set: { 
                    "myTotalBlogs": { $size: "$myBlogs" }
                }
            },
            {
                $lookup: {
                    from: "follow_user",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "myFollowings"
                }
            },
            {
                $addFields: {
                    "myTotalFollowings": { $size: "$myFollowings" }
                }
            },
            {
                $lookup: {
                    from: "follow_user",
                    localField: "_id",
                    foreignField: "following_user_id",
                    as: "myFollowers"
                }
            },
            {
                $addFields: {
                    "myTotalFollowers": { $size: "$myFollowers" }
                }
            },
            {
                $lookup: {
                    from: "bookmark_blog",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "myBookmarkedBlogs"
                }
            },
            {
                $set: {
                    "myTotalBookmarkedBlogs": { $size: "$myBookmarkedBlogs" }
                }
            },
            {
                $lookup: {
                    from: "like_blog",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "myLikedBlogs"
                }
            },
            {
                $set: {
                    "myTotalLikedBlogs": { $size: "$myLikedBlogs" }
                }
            }
        ])
        if (getData) {
            return res.status(200).json({
                status_code: 200,
                message: "Data fetched successfully",
                response: getData
            })
        } else {
            throw new Error("Something went wrong")
        }
    } catch (error) {
        res.status(403).json({
            status_code: 403,
            message: error.message
        })
    }
}

exports.blogPostedUserList = async (req, res) => {
    try {
        let getData = await BlogModel.aggregate([
            {
                $group: { _id : "$user_id"}
            },
            {
                $lookup: {
                    from: "user",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            }
        ])
        if (getData) {
            return res.status(200).json({
                status_code: 200,
                message: "Data fetched successfully",
                response: getData
            })
        } else {
            throw new Error("Something went wrong")
        }
    } catch (error) {
        res.status(403).json({
            status_code: 403,
            message: error.message
        })
    }
}

exports.followerFollowingUserList = async (req, res) => {
    try {
        // $facet creates multiple pipeline within a single stage on the same set of input documents.
        let getData = await FollowUserModel.aggregate([
            {
                $facet: {
                    "totalFollowings": [
                        {
                            $match: { 
                                user_id: req.userData._id
                            }
                        },
                        {
                            $lookup: {
                                from: "user",
                                localField: "following_user_id",
                                foreignField: "_id",
                                as: "users"
                            }
                        },
                        {
                            $unwind: "$users"
                        },
                        {
                            $project: {
                                user_id: 0,
                                following_user_id: 0
                            }
                        }
                    ],
                    "totalFollowers": [
                        {
                            $match: { 
                                following_user_id: req.userData._id
                            }
                        },
                        {
                            $lookup: {
                                from: "user",
                                localField: "user_id",
                                foreignField: "_id",
                                as: "users"
                            }
                        },
                        {
                            $unwind: "$users"
                        },
                        {
                            $project: {
                                user_id: 0,
                                following_user_id: 0
                            }
                        }
                    ]
                }
            }
        ])
        if (getData) {
            return res.status(200).json({
                status_code: 200,
                message: "Data fetched successfully",
                response: getData[0]
            })
        } else {
            throw new Error("Something went wrong")
        }
    } catch (error) {
        res.status(403).json({
            status_code: 403,
            message: error.message
        })
    }
}

exports.copyUserCollections = async (req, res) => {
    try {
        // merge Writes the results of the aggregation pipeline to a specified collection. The $merge operator must be the last stage in the pipeline.
        let getData = await UserModel.aggregate([
            { $merge: { into: "usersCopy", on: "_id", whenMatched: "replace", whenNotMatched: "insert" } }
        ])

        if (getData) {
            return res.status(200).json({
                status_code: 200,
                message: "Data copied successfully",
            })
        } else {
            throw new Error("Something went wrong")
        }
    } catch (error) {
        res.status(403).json({
            status_code: 403,
            message: error.message
        })
    }
}

exports.copyCollectionIntoDifferentDb = async (req, res) => {
    try {
        // merge Writes the results of the aggregation pipeline to a specified collection. The $merge operator must be the last stage in the pipeline.
        let getData = await BlogModel.aggregate([
            { $merge: {
                    into: { db: "testdbcopy", coll: "blog" }
                }
            }
        ])

        if (getData) {
            return res.status(200).json({
                status_code: 200,
                message: "Data copied successfully",
            })
        } else {
            throw new Error("Something went wrong")
        }
    } catch (error) {
        res.status(403).json({
            status_code: 403,
            message: error.message
        })
    }
}

exports.replaceRootApi = async (req, res) => {
    try {
        // replaceRoot Replaces the input document with the specified document. The operation replaces all existing fields in the input document, including the _id field. You can promote an existing embedded document to the top level, or create a new document for promotion.
        let getData = await UserModel.aggregate([
            {
                $replaceRoot: {
                   newRoot: {
                        _id: "$_id",
                        full_name: {
                            $concat : [ "$first_name", " ", "$last_name" ]
                        },
                        mobile_number: {
                            $concat : [ "$country_code", "-", "$mobile_number" ]
                        },
                        email: "$email",
                        password: "$password",
                        address: "$address",
                        access_token: "$access_token",
                        created_on: "$created_on"
                   }
                }
             }
        ])

        if (getData) {
            return res.status(200).json({
                status_code: 200,
                message: "Field replaced successfully",
                response: getData
            })
        } else {
            throw new Error("Something went wrong")
        }
    } catch (error) {
        res.status(403).json({
            status_code: 403,
            message: error.message
        })
    }
}

exports.randomlySelectDocumentsFromCollection = async (req, res) => {
    try {
        // $sample aggregation operation randomly selects documents from the collection.
        let getData = await UserModel.aggregate([
            { 
                $sample: { size: 3 } 
            }
        ])

        if (getData) {
            return res.status(200).json({
                status_code: 200,
                message: "Documents randomly fetched successfully",
                response: getData
            })
        } else {
            throw new Error("Something went wrong")
        }
    } catch (error) {
        res.status(403).json({
            status_code: 403,
            message: error.message
        })
    }
}

exports.unionWithApi = async (req, res) => {
    try {
        // $unionWith combines pipeline results from two collections into a single result set. The stage outputs the combined result set (including duplicates) to the next stage.
        let getData = await LikeBlogModel.aggregate([
            { 
                $project: { user_id:1 } 
            },
            { 
                $unionWith: { 
                    coll: "bookmark_blog", 
                    pipeline: [ 
                        { 
                            $project: { user_id: 1 } 
                        } 
                    ]
                } 
            },
            { $unset: "_id" } // unset removes fields from documents fetched
        ])

        if (getData) {
            return res.status(200).json({
                status_code: 200,
                message: "Data fetched successfully",
                response: getData
            })
        } else {
            throw new Error("Something went wrong")
        }
    } catch (error) {
        res.status(403).json({
            status_code: 403,
            message: error.message
        })
    }
}