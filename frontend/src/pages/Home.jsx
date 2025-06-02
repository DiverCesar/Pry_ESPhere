// src/pages/Home.jsx
import { useAuth } from '../hooks/useAuth.jsx';
import { Spinner } from 'flowbite-react';
import { Link } from 'react-router-dom'; // ← Asegúrate de importar Link aquí

function Home() {
  const { user, loading } = useAuth();

  console.log('Home → user:', user, 'loading:', loading);

  // Mientras loading sea true, mostramos un spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" color="info" aria-label="Cargando..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Bienvenido a Mi Red Social</h1>
      {!user ? (
        <>
          <p className="text-gray-600">
            Por favor, inicia sesión o regístrate para comenzar.
          </p>
          <div className="space-x-2">
            <Link
              to="/login"
              className="text-blue-600 hover:underline"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="text-blue-600 hover:underline"
            >
              Registrarse
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-600">¡Hola, {user.nombre}!</p>
          <div className="space-x-2">
            <Link
              to="/create-profile"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Crear/Editar Perfil
            </Link>
            <Link
              to="/view-profile"
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Ver Perfil
            </Link>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Panel Admin
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;