import { useEffect, useRef, useState } from 'react';
import { Button } from 'flowbite-react';

function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    let stream;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      } catch (err) {
        console.error('Error accediendo a la cámara:', err);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
  };

  return (
    <div className="flex flex-col items-center">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-64 h-48 bg-black rounded-md shadow"
      />
      <Button
        onClick={handleCapture}
        disabled={!streaming}
        className="mt-2"
        gradientMonochrome="info"
        size="sm"
      >
        Capturar Foto
      </Button>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default CameraCapture;