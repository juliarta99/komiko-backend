const router = require('express').Router()
const comicController = require('../controller/comic.controller');

// routes
router.get('/', comicController.getComics);
router.get('/:comicId', comicController.getComicDetails);
router.get('/chapter/:chapterId', comicController.getChapterById);

module.exports = router