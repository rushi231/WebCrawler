const express = require('express');
const router = express.Router();
const { signUp, signIn } = require('../controllers/authController');
const { deleteUser, updateRole, blockUser, getUser } = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth')

router.post('/signup', signUp);
router.post('/signin', signIn);

router.patch('/users/:id/role',authenticateToken, requireAdmin, updateRole);
router.delete('/users/:id',authenticateToken, requireAdmin, deleteUser)
router.patch('/users/:id/block',authenticateToken, requireAdmin, blockUser)
router.get('/users',authenticateToken, requireAdmin, getUser);

module.exports = router;