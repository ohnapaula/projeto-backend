const router = require('express').Router();
const controller = require('../controllers/categoryController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { id, pagination, category } = require('../validators/schemas');

router.get('/search', validate(pagination, 'query'), controller.search);
router.get('/:id', validate(id, 'params'), controller.getById);
router.post('/', auth, validate(category), controller.create);
router.put('/:id', auth, validate(id, 'params'), validate(category), controller.update);
router.delete('/:id', auth, validate(id, 'params'), controller.remove);
module.exports = router;
