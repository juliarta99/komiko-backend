const router = require('express').Router()

router.use('/api/genre', require('./genre.routes'))
router.use('/api/search', require('./search.routes'))
router.use('/api/manga', require('./manga.routes'))
router.use('/api/manhwa', require('./manhwa.routes'))
router.use('/api/manhua', require('./manhua.routes'))

module.exports = router