const express = require('express');
const router = express.Router();
const { getMachines, getMachine, getFeatured, getBrands } = require('../controllers/machineController');

router.get('/', getMachines);
router.get('/featured', getFeatured);
router.get('/brands', getBrands);
router.get('/:slug', getMachine);

module.exports = router;
