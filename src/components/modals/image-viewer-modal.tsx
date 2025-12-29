import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import Text from '../ui/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ACCESS_TOKEN_KEY} from '../../constants/constants.api';
import RNFS from 'react-native-fs';

interface ImageViewerModalProps {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  visible,
  imageUrl,
  onClose,
}) => {
  const [token, setToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [localImageUri, setLocalImageUri] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (visible && imageUrl) {
      loadAndDownloadImage();
    }
    return () => {
      // Limpiar al cerrar
      setLocalImageUri(null);
      setError(false);
      setLoading(true);
    };
  }, [visible, imageUrl]);

  const loadAndDownloadImage = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      setToken(accessToken);
      
      console.log('[ImageViewer] Loading image:', imageUrl);
      console.log('[ImageViewer] Token present:', !!accessToken);

      // Descargar la imagen con el token
      const fileName = imageUrl.split('/').pop() || 'temp_image.jpg';
      const localPath = `${RNFS.CachesDirectoryPath}/${Date.now()}_${fileName}`;

      const downloadResult = await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: localPath,
        headers: accessToken ? {
          Authorization: `Bearer ${accessToken}`,
        } : {},
      }).promise;

      if (downloadResult.statusCode === 200) {
        console.log('[ImageViewer] Image downloaded to:', localPath);
        const fileUri = Platform.OS === 'android' ? `file://${localPath}` : localPath;
        setLocalImageUri(fileUri);
        setLoading(false);
      } else {
        console.error('[ImageViewer] Download failed:', downloadResult.statusCode);
        setError(true);
        setLoading(false);
      }
    } catch (err) {
      console.error('[ImageViewer] Error downloading image:', err);
      setError(true);
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {loading && !error && (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No se pudo cargar la imagen</Text>
          </View>
        )}

        {localImageUri && !loading && !error && (
          <Image
            style={styles.image}
            source={{uri: localImageUri}}
            resizeMode="contain"
            onError={(e) => {
              console.error('[ImageViewer] Load error:', e.nativeEvent);
              setError(true);
            }}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
  },
  errorContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
  },
});
