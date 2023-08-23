const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.get('/', gameController.homepage);
router.get('/exploreAgents', gameController.exploreAgents);
router.get('/exploreMaps', gameController.exploreMaps);
router.get('/blog/:id', gameController.blog);
router.get('/agent/:id', gameController.agent);
router.get('/map/:id', gameController.map);
router.post('/search', gameController.searchBlogs);
router.get('/explore-latest', gameController.exploreLatest);
router.get('/submit-blog', gameController.submitBlog);
router.post('/submit-blog', gameController.submitBlogOnPost);
// router.get('/exploreBlogs', gameController.exploreBlogs);

module.exports = router;