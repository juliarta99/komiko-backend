const router = require('express').Router()
const searchController = require('../controller/search.controller')
// routes
router.get('/:search', searchController.getBySearch);
router.get('/:search/page/:page', searchController.getBySearchAndPage);

module.exports = router