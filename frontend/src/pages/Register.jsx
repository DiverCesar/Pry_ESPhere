import { useState } from 'react';
import { Label, TextInput, Button } from 'flowbite-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth.jsx';

function Register() {
  const [form, setForm] = useState({ nombre: '', edad: '', departamento: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth(); // para informar inmediatamente al contexto

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', form);
      const { token, user: userData } = res.data;
      if (token) {
        localStorage.setItem('token', token);
        if (userData) setUser(userData);
        navigate('/');
        window.location.reload();
      } else {
        setError('No se recibió token al registrarse.');
      }
    }
    catch (err) {
      setError(err.response?.data?.mensaje || 'Error registrando.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h2 className="text-2xl font-semibold mb-4">Registro de Usuario</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <Label htmlFor="nombre" value="Nombre completo" />
          <TextInput id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="edad" value="Edad" />
          <TextInput id="edad" type="number" name="edad" value={form.edad} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="departamento" value="Departamento" />
          <TextInput id="departamento" name="departamento" value={form.departamento} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email" value="Email" />
          <TextInput id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="password" value="Contraseña" />
          <TextInput id="password" type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <Button type="submit" gradientMonochrome="info" className="w-full">Registrarse</Button>
        <p className="mt-2 text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;