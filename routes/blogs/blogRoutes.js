const express = require('express');
const blogController = require('../../controllers/blogController');
const {
  requireSignin,
  adminMiddleware,
  authMiddleware,
  canUpdateDeleteBlog,
} = require('../../controllers/authcontroller');

const router = express.Router();

router
  .route('/blog')
  .post(requireSignin, adminMiddleware, blogController.create);

router.route('/blogs').get(blogController.list);
router
  .route('/blogs-categories-tags')
  .post(blogController.listAllBlogsCategoriesTags);
router
  .route('/blog/:slug')
  .get(blogController.read)
  .delete(requireSignin, adminMiddleware, blogController.remove)
  .put(requireSignin, adminMiddleware, blogController.update);

router.route('/blogs/photo/:slug').get(blogController.photo);
router.route('/blog/related').post(blogController.listRelated);
router.route('/blogs/search').get(blogController.listSearch);

//user routes for creating, updating and deleting blogs
router
  .route('/user/blog')
  .post(requireSignin, authMiddleware, blogController.create);

router.route('/:username/blogs').get(blogController.listByUser);

router
  .route('/user/blog/:slug')
  .put(
    requireSignin,
    authMiddleware,
    canUpdateDeleteBlog,
    blogController.update,
  )
  .delete(
    requireSignin,
    authMiddleware,
    canUpdateDeleteBlog,
    blogController.remove,
  );

module.exports = router;
