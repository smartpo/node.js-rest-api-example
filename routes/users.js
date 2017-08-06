import express from 'express';
import UserController from '../controllers/user-controller';
import auth from '../components/auth';

const router = express.Router();
const controller = new UserController();
const {list, create, login, view} = controller; 

router.post('/user', create.bind(controller));
router.post('/user/login', login.bind(controller));
router.get('/me', auth.Verify, view.bind(controller));
router.get('/users', auth.Verify, list.bind(controller));

module.exports = router;