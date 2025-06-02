import { useEffect, useState } from 'react';
import { Label, TextInput, Button, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CameraCapture from '../components/CameraCapture';
import LocationButton from '../components/LocationButton';
import LogoutButton from '../components/LogoutButton';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function CreateProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    nombre: '',
    edad: '',
    departamento: '',
    fotoBase64: '',
    ubicacion: { lat: null, lng: null },
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Al montar, intento obtener el perfil existente
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/users/me');
        const data = res.data;
        setProfile({
          nombre: data.nombre,
          edad: data.edad || '',
          departamento: data.departamento,
          fotoBase64: data.fotoURL || '',
          ubicacion: {
            lat: data.ubicacion?.lat || null,
            lng: data.ubicacion?.lng || null,
          },
        });
      } catch (err) {
        // Si no existe, se supone que es primera vez; no es un error crítico
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleCapture = (dataUrl) => {
    setProfile({ ...profile, fotoBase64: dataUrl });
  };

  const handleLocation = (coords) => {
    setProfile({ ...profile, ubicacion: coords });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Primero obtengo mi ID actual
      const meRes = await api.get('/users/me');
      const myId = meRes.data._id;

      // Preparo body (solo campos que quiero actualizar)
      const body = {
        nombre: profile.nombre,
        edad: parseInt(profile.edad, 10),
        departamento: profile.departamento,
        fotoURL: profile.fotoBase64,
        ubicacion: profile.ubicacion,
      };

      await api.put(`/users/${myId}`, body);
      navigate('/view-profile');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.mensaje || 'Error guardando el perfil.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="xl" color="info" aria-label="Cargando perfil" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Botón de Cerrar Sesión */}
      <div className="flex justify-end">
        <LogoutButton />
      </div>

      <h2 className="text-2xl font-bold mb-4">Crear / Editar mi Perfil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <Label htmlFor="nombre" value="Nombre completo" />
          <TextInput
            id="nombre"
            name="nombre"
            value={profile.nombre}
            onChange={handleChange}
            required
          />
        </div>

        {/* Edad */}
        <div>
          <Label htmlFor="edad" value="Edad" />
          <TextInput
            id="edad"
            name="edad"
            type="number"
            value={profile.edad}
            onChange={handleChange}
            required
          />
        </div>

        {/* Departamento */}
        <div>
          <Label htmlFor="departamento" value="Departamento" />
          <TextInput
            id="departamento"
            name="departamento"
            value={profile.departamento}
            onChange={handleChange}
            required
          />
        </div>

        {/* Foto con cámara */}
        <div>
          <Label value="Foto desde cámara" />
          <CameraCapture onCapture={handleCapture} />
          {profile.fotoBase64 && (
            <img
              src={profile.fotoBase64}
              alt="Previsualización"
              className="w-32 h-32 object-cover mt-2 rounded-md shadow"
            />
          )}
        </div>

        {/* Ubicación */}
        <div>
          <Label value="Ubicación" />
          <LocationButton onLocation={handleLocation} />
          {profile.ubicacion.lat && (
            <p className="mt-1 text-sm text-gray-700">
              Lat: {profile.ubicacion.lat.toFixed(5)}, Lng:{' '}
              {profile.ubicacion.lng.toFixed(5)}
            </p>
          )}
        </div>

        {/* Mapa de ubicación */}
        {profile.ubicacion.lat && (
          <div className="h-64 w-full mt-2">
            <MapContainer
              center={[profile.ubicacion.lat, profile.ubicacion.lng]}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full rounded-md shadow"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[profile.ubicacion.lat, profile.ubicacion.lng]}>
                <Popup>Mi ubicación</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {error && <p className="text-red-600">{error}</p>}

        <Button type="submit" gradientMonochrome="info" className="w-full">
          Guardar Perfil
        </Button>
      </form>
    </div>
  );
}

export default CreateProfile;