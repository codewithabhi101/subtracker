const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getAll, create, update, remove } = require('../controllers/subController');

router.use(protect);
router.route('/').get(getAll).post(create);
router.route('/:id').put(update).delete(remove);

module.exports = router;