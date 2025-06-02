import { useAuth } from '../hooks/useAuth.jsx';
import { Spinner } from 'flowbite-react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function Navbar() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <span className="font-bold">Mi Red Social</span>
        <Spinner size="sm" color="info" aria-label="Cargando…" />
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">
        Mi Red Social
      </Link>
      <div className="flex items-center space-x-4">
        {!user && (
          <>
            <Link to="/login" className="text-blue-600 hover:underline">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="text-blue-600 hover:underline">
              Registrarse
            </Link>
          </>
        )}
        {user && (
          <>
            {/* Si es admin, mostrar enlace a AdminDashboard */}
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Panel Admin
              </Link>
            )}

            {/* Enlace para crear o ver perfil según convenga */}
            <Link to="/view-profile" className="text-gray-700 hover:underline">
              Mi Perfil
            </Link>
            <LogoutButton />
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;