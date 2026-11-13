import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  X, 
  RotateCw, 
  AlertCircle, 
  Check, 
  Sparkles, 
  FlipHorizontal,
  RefreshCw
} from 'lucide-react';

export default function CameraCaptureModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // Check if device has multiple cameras (e.g. mobile back vs front)
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);
      }).catch(() => {});
    }
  }, []);

  // Initialize and stop camera stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by your browser or environment. Please upload an image file instead.');
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera access failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera permissions in your browser or address bar, or upload an image file.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device was detected on your system. Please upload a photo from your computer.');
      } else {
        setCameraError(`Unable to start camera (${err.message || 'Unknown error'}). Please try uploading an image instead.`);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to high-quality JPEG data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    setTimeout(() => {
      setIsCapturing(false);
      stopCamera();
      onCapture(dataUrl);
      onClose();
    }, 250);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-cream-300 w-full max-w-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-forest-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-forest-700 text-softYellow flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Live Kitchen Camera</h3>
              <p className="text-[11px] text-sage-200">Position your ingredients or refrigerator shelves</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative bg-black h-80 sm:h-96 flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-8 text-center text-white space-y-3 max-w-md">
              <div className="w-12 h-12 rounded-full bg-coral-500/20 text-coral-400 mx-auto flex items-center justify-center border border-coral-500/40">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-white">Camera Unavailable</h4>
              <p className="text-xs text-sage-200 leading-relaxed">{cameraError}</p>
              <button
                type="button"
                onClick={startCamera}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-forest-700 text-white font-bold text-xs hover:bg-forest-600 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Camera</span>
              </button>
            </div>
          ) : (
            <>
              {/* Video Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Overlay */}
              <div className="absolute inset-8 border border-white/40 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <span className="w-4 h-4 border-t-2 border-l-2 border-softYellow"></span>
                  <span className="w-4 h-4 border-t-2 border-r-2 border-softYellow"></span>
                </div>
                <div className="text-center text-[11px] font-semibold text-white/80 bg-black/40 px-3 py-1 rounded-full mx-auto backdrop-blur-sm">
                  Center fresh produce or crisper contents
                </div>
                <div className="flex justify-between">
                  <span className="w-4 h-4 border-b-2 border-l-2 border-softYellow"></span>
                  <span className="w-4 h-4 border-b-2 border-r-2 border-softYellow"></span>
                </div>
              </div>

              {/* Flash effect when taking photo */}
              {isCapturing && (
                <div className="absolute inset-0 bg-white animate-fade-out pointer-events-none"></div>
              )}
            </>
          )}

          {/* Hidden Canvas for Frame Capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Footer */}
        <div className="px-6 py-4 bg-cream-50 border-t border-cream-200 flex items-center justify-between">
          <div>
            {hasMultipleCameras && !cameraError && (
              <button
                type="button"
                onClick={toggleCameraFacing}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-sage-300 text-forest-800 text-xs font-bold hover:bg-cream-100 transition-colors"
                title="Switch between front and rear cameras"
              >
                <FlipHorizontal className="w-3.5 h-3.5 text-forest-700" />
                <span className="hidden sm:inline">Flip Camera</span>
              </button>
            )}
          </div>

          {/* Shutter Button */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              disabled={Boolean(cameraError)}
              onClick={handleTakePhoto}
              className="w-14 h-14 rounded-full bg-forest-700 border-4 border-white shadow-soft-lg flex items-center justify-center text-white hover:bg-forest-800 disabled:opacity-40 disabled:cursor-not-allowed group transition-transform active:scale-95"
              aria-label="Capture photo"
            >
              <div className="w-10 h-10 rounded-full bg-coral-500 flex items-center justify-center transition-transform group-hover:scale-95">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-textMuted hover:text-textDark transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
