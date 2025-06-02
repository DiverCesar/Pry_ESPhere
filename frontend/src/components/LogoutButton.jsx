// src/components/LogoutButton.jsx
import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx'; // Importamos el hook

function LogoutButton() {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Tomamos setUser del contexto

  const handleLogout = () => {
    // 1) Quitamos el token
    localStorage.removeItem('token');
    // 2) Limpiamos el estado de user en el contexto
    setUser(null);
    // 3) Redirigimos a login
    navigate('/login');
  };

  return (
    <Button
      gradientMonochrome="failure"
      size="sm"
      onClick={handleLogout}
      className="mt-2"
    >
      Cerrar Sesión
    </Button>
  );
}

export default LogoutButton;