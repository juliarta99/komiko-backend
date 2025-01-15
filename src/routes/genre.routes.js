const router = require('express').Router()
const genreController = require('../controller/genre.controller')

// routes
router.get('/all', genreController.all);

module.exports = router