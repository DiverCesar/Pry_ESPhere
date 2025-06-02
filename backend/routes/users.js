const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { getMyProfile, getAllUsers, deleteUser, updateUser } = require('../controllers/userController');

// GET /api/users/me → obtener perfil propio
router.get('/me', verifyToken, getMyProfile);

// GET /api/users → obtener todos (solo admin)
router.get('/', verifyToken, getAllUsers);

// DELETE /api/users/:id → eliminar (admin o propio)
router.delete('/:id', verifyToken, deleteUser);

// PUT /api/users/:id → actualizar perfil propio
router.put('/:id', verifyToken, updateUser);

module.exports = router;