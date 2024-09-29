import { useState, useEffect, useRef } from 'react';

const useWebcam = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas')); // Create a canvas for taking snapshot

  useEffect(() => {
    const getWebcamStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Error accessing webcam:", err);
        setHasPermission(false);
      }
    };
    getWebcamStream();
  }, []);

  const takeSnapshot = () => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png'); // return base64 image
  };

  return { videoRef, hasPermission, takeSnapshot };
};

export default useWebcam;