const router = require('express').Router();
const userController = require('./../controller/user.controller');
const { celebrate } = require('celebrate');
const user = require('./../modules/authentication');

const {
    REGISTERUSER,
    ADDBLOG,
    EDITBLOG,
    LIKEBLOG,
    BLOGLIKEDUSERS,
    FOLLOWUSER,
    BOOKMARKBLOG,
    DELETEBLOG,
    VIEWBLOG,
    BLOGVIEWCOUNT,
    LOGINUSER,
  } = require('./../validation/userValidation');


router.post('/register_user', celebrate({ body: REGISTERUSER }, { abortEarly: false }), userController.signupUser);
router.post('/add_blog', celebrate({ body: ADDBLOG }, { abortEarly: false }), user.verifyUserToken, userController.addBlog);
router.put('/edit_blog', celebrate({ body: EDITBLOG }, { abortEarly: false }), user.verifyUserToken, userController.editBlog);
router.get('/get_blog_list', user.verifyUserToken, userController.getBlogList);
router.post('/like_blog', celebrate({ body: LIKEBLOG }, { abortEarly: false }), user.verifyUserToken, userController.likeBlog);
router.post('/blog_liked_users', celebrate({ body: BLOGLIKEDUSERS }, { abortEarly: false }), user.verifyUserToken, userController.blogLikedUsers);
router.post('/follow_unfollow_user', celebrate({ body: FOLLOWUSER }, { abortEarly: false }), user.verifyUserToken, userController.followUser);

// query- find the list of all the users who have posted blogs
router.get('/blog_posted_users', userController.blogPostedUsers);

router.put('/reset_password_all_users',user.verifyUserToken, userController.resetPasswordFoAllUsers);

router.post('/bookmark_blog', celebrate({ body: BOOKMARKBLOG }, { abortEarly: false }), user.verifyUserToken, userController.bookmarkBlog);

router.get('/get_user_list', userController.getUserList);
router.get('/my_bookmarked_blogs', user.verifyUserToken, userController.myBookmarkedBlogs);

router.delete('/delete_blog', celebrate({ body: DELETEBLOG }, { abortEarly: false }), user.verifyUserToken, userController.deleteBlog);
router.post('/view_blog', celebrate({ body: VIEWBLOG }, { abortEarly: false }), user.verifyUserToken, userController.viewBlog);
router.post('/blog_views_count', celebrate({ body: BLOGVIEWCOUNT }, { abortEarly: false }), user.verifyUserToken, userController.blogViewCount);
router.post('/login_user', celebrate({ body: LOGINUSER }, { abortEarly: false }), userController.loginUser);

router.get('/my_blog_and_following_list', user.verifyUserToken, userController.myBlogAndFollowingList);

router.get('/blog_posted_user_list', userController.blogPostedUserList);

router.get('/follower_following_users', user.verifyUserToken, userController.followerFollowingUserList);

router.get('/copy_user_collection', userController.copyUserCollections);

router.get('/copy_collection_into_different_db', userController.copyCollectionIntoDifferentDb);

router.get('/replace_root_api', userController.replaceRootApi);

router.get('/randomly_select_documents_from_collection', userController.randomlySelectDocumentsFromCollection);

router.get('/unionWith_api', userController.unionWithApi);


module.exports = router;