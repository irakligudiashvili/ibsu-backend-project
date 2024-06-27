var express = require('express');
var router = express.Router();

const postService = require('../services/postService');

router.get('/', postService.getAll);

router.get('/add', (req, res) => {
    console.log('Rendering add.ejs');
    res.render('add');
});

router.post('/add', postService.add);

router.get('/edit/:id', postService.getPostData);
router.post('/update/:id', postService.updatePost);

router.get('/search/:searchTerm', postService.getByTerm);
router.get('/author/:authorName', postService.getByAuthor);
router.get('/:id', postService.getById);
router.post('/:id/comment', postService.addComment);
router.delete('/:id', postService.delete);

router.delete('/delete-comment/:postId/:commentId', postService.deleteComment);


module.exports = router;