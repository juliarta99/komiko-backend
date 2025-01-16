const router = require('express').Router()

router.use('/comic', require('./comic.routes'))
router.use('/genre', require('./genre.routes'))
router.use('/search', require('./search.routes'))

module.exports = router