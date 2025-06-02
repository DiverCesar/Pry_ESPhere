const User = require('../models/User');

// Obtener mi perfil (a partir del token)
async function getMyProfile(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password'); // excluir contraseña
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
}

// Obtener todos los usuarios (solo admin)
async function getAllUsers(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado, solo admin.' });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
}

// Eliminar usuario (admin o auto)
async function deleteUser(req, res) {
  try {
    const targetId = req.params.id;
    const currentUser = req.user; // { id, role }

    if (currentUser.role !== 'admin' && currentUser.id !== targetId) {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar.' });
    }

    const deleted = await User.findByIdAndDelete(targetId);
    if (!deleted) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });

    res.json({ mensaje: 'Usuario eliminado correctamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
}

// Editar perfil propio (solo fields permitidos)
async function updateUser(req, res) {
  try {
    const targetId = req.params.id;
    const currentUser = req.user;

    if (currentUser.id !== targetId) {
      return res.status(403).json({ mensaje: 'Solo puedes editar tu propio perfil.' });
    }

    const { nombre, edad, departamento, fotoURL, ubicacion } = req.body;
    const updated = await User.findByIdAndUpdate(
      targetId,
      { nombre, edad, departamento, fotoURL, ubicacion },
      { new: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    res.json({ mensaje: 'Perfil actualizado.', user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
}

module.exports = { getMyProfile, getAllUsers, deleteUser, updateUser };