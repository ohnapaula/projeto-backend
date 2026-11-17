const router = require('express').Router();
const controller = require('../controllers/userController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { id, userCreate, userUpdate, login } = require('../validators/schemas');

router.post('/token', validate(login), controller.token);
router.post('/', validate(userCreate), controller.create);
router.get('/:id', validate(id, 'params'), controller.getById);
router.put('/:id', auth, validate(id, 'params'), validate(userUpdate), controller.update);
router.delete('/:id', auth, validate(id, 'params'), controller.remove);
module.exports = router;
