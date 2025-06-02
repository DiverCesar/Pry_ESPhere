import { useEffect, useState } from 'react';
import { Spinner, Table, Button } from 'flowbite-react';
import api from '../utils/api';
import LogoutButton from '../components/LogoutButton';

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  // Para posts globales (si los implementas)
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // Traer todos los usuarios
        const resUsers = await api.get('/users');
        setUsuarios(resUsers.data);

        // *** Si tuvieras endpoint de posts globales:
        //const resPosts = await api.get('/posts');
        //setAllPosts(resPosts.data);
      } catch (err) {
        console.error(err);
        setError('Error cargando datos de administración.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return;
    try {
      await api.delete(`/users/${userId}`);
      setUsuarios((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.mensaje || 'Error al eliminar usuario.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" color="info" aria-label="Cargando admin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Botón de Cerrar Sesión */}
      <div className="flex justify-end">
        <LogoutButton />
      </div>

      <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>

      {/* Sección Usuarios */}
      <div className="bg-white p-4 rounded-md shadow">
        <h3 className="text-xl font-semibold mb-2">Usuarios Registrados</h3>
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Nombre</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Departamento</Table.HeadCell>
            <Table.HeadCell>Rol</Table.HeadCell>
            <Table.HeadCell>Acciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {usuarios.map((u) => (
              <Table.Row key={u._id} className="bg-white">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                  {u.nombre}
                </Table.Cell>
                <Table.Cell>{u.email}</Table.Cell>
                <Table.Cell>{u.departamento}</Table.Cell>
                <Table.Cell>{u.role}</Table.Cell>
                <Table.Cell>
                  <Button
                    size="xs"
                    color="failure"
                    onClick={() => handleDeleteUser(u._id)}
                  >
                    Eliminar
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Opcional: sección de Posts globales */}
      <div className="bg-white p-4 rounded-md shadow">
        <h3 className="text-xl font-semibold mb-2">Posts Globales (si aplica)</h3>
        {allPosts.length === 0 ? (
          <p className="text-gray-600">No hay posts para mostrar.</p>
        ) : (
          allPosts.map((post) => (
            <div
              key={post._id}
              className="border-b last:border-none pb-2 mb-2 space-y-1"
            >
              <p className="font-semibold">
                {post.autorNombre} ({post.autorEmail})
              </p>
              <p>{post.texto}</p>
              {post.ubicacion && (
                <p className="text-sm text-gray-500">
                  Ubicación: {post.ubicacion.lat.toFixed(4)},{' '}
                  {post.ubicacion.lng.toFixed(4)}
                </p>
              )}
              <div className="flex items-center space-x-4">
                <Button size="xs" color="gray">
                  👍 {post.likes || 0}
                </Button>
                <Button size="xs" color="gray">
                  💬 {post.comentarios?.length || 0}
                </Button>
                <Button size="xs" color="failure">
                  Eliminar
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;