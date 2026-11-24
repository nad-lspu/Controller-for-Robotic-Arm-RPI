
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface CameraContextType {
  cameraFeedUrl: string | null;
  isCameraConnected: boolean;
  connectCamera: () => void;
  disconnectCamera: () => void;
}

const CameraContext = createContext<CameraContextType | undefined>(
  undefined
);

interface CameraProviderProps {
  children: ReactNode;
}

export const CameraProvider = ({ children }: CameraProviderProps) => {
  const [cameraFeedUrl, setCameraFeedUrl] = useState<string | null>(null);
  const [isCameraConnected, setIsCameraConnected] = useState(false);

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const cameraFeedBlobURLRef = useRef<string | null>(null);

  const disconnectCamera = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;

      window.electron.closeCameraWS();
    }

    if (cameraFeedBlobURLRef.current) {
      URL.revokeObjectURL(cameraFeedBlobURLRef.current);
      cameraFeedBlobURLRef.current = null;
    }

    setCameraFeedUrl(null);
    setIsCameraConnected(false);
  }, []);

  const connectCamera = useCallback(() => {
    // Prevent duplicate camera connections.
    if (unsubscribeRef.current) return;

    unsubscribeRef.current = window.electron.connectCameraWS(
      (imageBlob) => {
        const imageBlobURL = URL.createObjectURL(imageBlob);

        if (cameraFeedBlobURLRef.current) {
          URL.revokeObjectURL(cameraFeedBlobURLRef.current);
        }

        cameraFeedBlobURLRef.current = imageBlobURL;
        setCameraFeedUrl(imageBlobURL);
      }
    );

    setIsCameraConnected(true);
  }, []);

  // The camera is disconnected only when the provider unmounts.
  useEffect(() => {
    return () => {
      disconnectCamera();
    };
  }, [disconnectCamera]);

  return (
    <CameraContext.Provider
      value={{
        cameraFeedUrl,
        isCameraConnected,
        connectCamera,
        disconnectCamera,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => {
  const context = useContext(CameraContext);

  if (!context) {
    throw new Error("useCamera must be used inside CameraProvider");
  }

  return context;
};
