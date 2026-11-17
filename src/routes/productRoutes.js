const router = require('express').Router();
const controller = require('../controllers/productController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { id, pagination, productBase, productUpdate } = require('../validators/schemas');

router.get('/search', validate(pagination, 'query'), controller.search);
router.get('/:id', validate(id, 'params'), controller.getById);
router.post('/', auth, validate(productBase), controller.create);
router.put('/:id', auth, validate(id, 'params'), validate(productUpdate), controller.update);
router.delete('/:id', auth, validate(id, 'params'), controller.remove);
module.exports = router;
