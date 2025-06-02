import { useEffect, useState } from 'react';
import { Button, Spinner } from 'flowbite-react';
import api from '../utils/api';
import LogoutButton from '../components/LogoutButton';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function ViewProfile() {
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState(null);
  const [error, setError] = useState('');
  // Para listar posts, reacciones, comentarios, definimos un estado inicial
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // Traer perfil propio
        const res = await api.get('/users/me');
        setPerfil(res.data);

        // *** Si ya tuvieras endpoint de posts, aquí podrías hacer: ***
        //const postsRes = await api.get('/posts/my-posts');
        //setPosts(postsRes.data);
      } catch (err) {
        console.error(err);
        setError('Error cargando perfil.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" color="info" aria-label="Cargando perfil" />
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
    <div className="max-w-lg mx-auto p-4 space-y-4">
      {/* Botón de Cerrar Sesión */}
      <div className="flex justify-end">
        <LogoutButton />
      </div>

      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-2xl font-bold mb-2">Mi Perfil</h2>
        <p>
          <strong>Nombre:</strong> {perfil.nombre}
        </p>
        <p>
          <strong>Edad:</strong> {perfil.edad}
        </p>
        <p>
          <strong>Departamento:</strong> {perfil.departamento}
        </p>
        {perfil.fotoURL && (
          <img
            src={perfil.fotoURL}
            alt="Mi foto"
            className="w-32 h-32 object-cover rounded-md shadow my-2"
          />
        )}
        {perfil.ubicacion?.lat && (
          <div className="h-64 w-full mt-2 rounded-md shadow overflow-hidden">
            <MapContainer
              center={[perfil.ubicacion.lat, perfil.ubicacion.lng]}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[perfil.ubicacion.lat, perfil.ubicacion.lng]}>
                <Popup>Mi ubicación</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>

      {/* Placeholder para sección de Posts y Comentarios */}
      <div className="bg-white p-4 rounded-md shadow">
        <h3 className="text-xl font-semibold mb-2">Mis Posts</h3>
        {posts.length === 0 ? (
          <p className="text-gray-600">Aún no has publicado nada.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="border-b last:border-none pb-2 mb-2 space-y-1"
            >
              <p className="font-semibold">{post.autorNombre}</p>
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
                {/* Si el post pertenece al usuario, puede editar / eliminar */}
                {post.autorId === perfil._id && (
                  <>
                    <Button size="xs" color="warning">
                      Editar
                    </Button>
                    <Button size="xs" color="failure">
                      Eliminar
                    </Button>
                  </>
                )}
              </div>
              {/* Lista de comentarios (simplificado) */}
              {post.comentarios && post.comentarios.length > 0 && (
                <div className="mt-2 pl-4 border-l">
                  {post.comentarios.map((com) => (
                    <div key={com._id} className="space-y-1 pb-2 border-b">
                      <p className="text-sm font-semibold">
                        {com.usuarioNombre}
                      </p>
                      <p className="text-sm">{com.texto}</p>
                      {com.autorId === perfil._id && (
                        <div className="flex space-x-2 text-xs">
                          <Button size="xs" color="warning">
                            Editar
                          </Button>
                          <Button size="xs" color="failure">
                            Eliminar
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ViewProfile;