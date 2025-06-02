import { useState } from 'react';
import { Label, TextInput, Button } from 'flowbite-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth.jsx';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
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
      const res = await api.post('/auth/login', form);
      const { token, user: userData } = res.data;
      if (token) {
        localStorage.setItem('token', token);
        if (userData) setUser(userData);
        navigate('/');
        window.location.reload();
      } else {
        setError('No se recibió token al iniciar sesión.');
      }} catch (err) {
        setError(err.response?.data?.mensaje || 'Error de login.');
      }
    };

    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <h2 className="text-2xl font-semibold mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="password" value="Contraseña" />
            <TextInput id="password" type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <Button type="submit" gradientMonochrome="info" className="w-full">Ingresar</Button>
          <p className="mt-2 text-sm">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">Regístrate</Link>
          </p>
        </form>
      </div>
    );
  }

  export default Login;