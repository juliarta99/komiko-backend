const router = require('express').Router()

router.use('/genre', require('./genre.routes'))
router.use('/search', require('./search.routes'))
router.use('/manga', require('./manga.routes'))
router.use('/manhwa', require('./manhwa.routes'))
router.use('/manhua', require('./manhua.routes'))

module.exports = router