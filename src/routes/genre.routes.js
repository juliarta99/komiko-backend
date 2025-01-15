const router = require('express').Router()
const genreController = require('../controller/genre.controller')

// routes
router.get('/all', genreController.getAll);
router.get('/:genreId', genreController.getById);
router.get('/:genreId/page/:page', genreController.getByIdAndPage);

module.exports = router