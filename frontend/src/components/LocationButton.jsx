import { useState } from 'react';
import { Button, Spinner } from 'flowbite-react';

function LocationButton({ onLocation }) {
  const [loading, setLoading] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalización no es soportada por este navegador.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onLocation({ lat: latitude, lng: longitude });
        setLoading(false);
      },
      (err) => {
        console.error('Error obteniendo ubicación:', err);
        alert('No se pudo obtener la ubicación.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={handleGetLocation}
        disabled={loading}
        gradientMonochrome="warning"
        size="sm"
      >
        {loading ? (
          <>
            <Spinner size="sm" light={true} /> Obteniendo…
          </>
        ) : (
          'Obtener Ubicación'
        )}
      </Button>
    </div>
  );
}

export default LocationButton;