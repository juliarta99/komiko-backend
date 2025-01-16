const router = require('express').Router()
const comicController = require('../controller/comic.controller');

// routes
router.get('/', comicController.getComics);

module.exports = router