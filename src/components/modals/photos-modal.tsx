import React, {useState, useEffect, useCallback} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Alert,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {useColors} from '../../hooks/hook.color';
import Text from '../ui/text';
import Button from '../ui/button';
import AppIcon from '../icons';
import Header from '../ui/header';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';

import {convertToFormData} from '../../utils/utils.functions';
import {screenW} from '../../theme/metrics';

type PhotosModalProps = {
  visible: boolean;
  onClose: () => void;
  onSend: (photos: any[]) => Promise<void>;
  isLoading?: boolean;
};

const PhotosModal = ({
  visible,
  onClose,
  onSend,
  isLoading,
}: PhotosModalProps) => {
  const colors = useColors();
  const [photos, setPhotos] = useState<any[]>([]);

  // Limpiar fotos cuando se cierra el modal
  useEffect(() => {
    if (!visible) {
      setPhotos([]);
    }
  }, [visible]);

  const selectImg = useCallback(async () => {
    try {
      const options: any = {
        title: 'Selecciona una imagen',
        selectionLimit: 0,
        mediaType: 'photo',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      const response = await launchImageLibrary(options);

      if (response.didCancel) {
        console.log('User cancelled gallery');
        return;
      }

      if (response.errorCode) {
        console.error(
          'Gallery Error:',
          response.errorCode,
          response.errorMessage,
        );
        Alert.alert('Error', 'No se pudo abrir la galería');
        return;
      }

      if (response?.assets) {
        if (response.assets.length > 1) {
          const selectedImages = response.assets.map(asset =>
            convertToFormData(asset),
          );
          setPhotos(prevPhotos => [...prevPhotos, ...selectedImages]);
        } else {
          const file = convertToFormData(response.assets[0]);
          setPhotos(prevPhotos => [...prevPhotos, file]);
        }
      }
    } catch (error) {
      console.error('Error selecting images:', error);
      Alert.alert('Error', 'No se pudo seleccionar las imágenes');
    }
  }, []);

  const takePicture = useCallback(async () => {
    try {
      console.log('takePicture called');

      // Solicitar permiso de cámara en Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permiso de Cámara',
            message:
              'La aplicación necesita acceso a tu cámara para tomar fotos',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Aceptar',
          },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permiso denegado',
            'Necesitas conceder permiso de cámara para usar esta función',
          );
          return;
        }
      }

      const options: any = {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
        saveToPhotos: false,
      };

      const response = await launchCamera(options);
      console.log('Camera response:', response);

      if (response.didCancel) {
        console.log('User cancelled camera');
        return;
      }

      if (response.errorCode) {
        console.error(
          'Camera Error:',
          response.errorCode,
          response.errorMessage,
        );
        Alert.alert(
          'Error',
          'No se pudo abrir la cámara. Verifica los permisos.',
        );
        return;
      }

      if (response?.assets && response.assets[0]) {
        const photo = response.assets[0];
        console.log('Photo captured:', photo);
        const photoAsset = {
          uri: photo.uri,
          type: photo.type,
          fileName: photo.fileName || `photo_${Date.now()}.jpg`,
          size: photo.fileSize,
        };
        const file = convertToFormData(photoAsset);
        console.log('Converted file:', file);
        setPhotos(prevPhotos => [...prevPhotos, file]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  }, []);

  const handleDelete = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handleSend = async () => {
    if (photos.length === 0) {
      Alert.alert('Error', 'Por favor, agregue al menos una foto');
      return;
    }

    console.log('PhotosModal handleSend called with photos:', photos);

    try {
      await onSend(photos);
      onClose();
    } catch (error) {
      console.error('Error in PhotosModal handleSend:', error);
      // El error ya se maneja en onSend
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.container,
            {backgroundColor: colors.white, shadowColor: colors.black},
          ]}>
          <Header
            title="Fotos"
            renderRight={
              <Pressable style={styles.closeButton} onPress={onClose}>
                <AppIcon name="close" color={colors.black} size={24} />
              </Pressable>
            }
          />

          <View style={styles.content}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.instructions}>
                <Text style={styles.instructionText}>
                  Añade fotos relacionadas con la visita
                </Text>
              </View>

              {photos.length > 0 && (
                <View style={styles.photoGrid}>
                  {photos.map((photo, index) => (
                    <View key={index} style={styles.photoContainer}>
                      <Image
                        source={{uri: photo.uri}}
                        style={styles.photoThumbnail}
                      />
                      <Pressable
                        style={[
                          styles.deleteButton,
                          {backgroundColor: colors.red},
                        ]}
                        onPress={() => handleDelete(index)}>
                        <AppIcon name="trash" size={14} color={colors.white} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.photoSourceButton,
                    {borderColor: colors.primary},
                  ]}
                  onPress={takePicture}>
                  <AppIcon name="camera" size={36} color={colors.primary} />
                  <Text color={colors.primary} fw="medium">
                    Tomar foto
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.photoSourceButton,
                    {borderColor: colors.primary},
                  ]}
                  onPress={selectImg}>
                  <AppIcon name="gallery" size={36} color={colors.primary} />
                  <Text color={colors.primary} fw="medium">
                    Galería
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <Button
              style={styles.saveButton}
              onPress={handleSend}
              size="smMd"
              disabled={photos.length === 0 || isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar fotos'}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: screenW * 0.85,
    maxWidth: 500,
    borderRadius: 16,
    padding: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 8,
  },
  instructions: {
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  photoContainer: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.66%',
    position: 'relative',
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  photoSourceButton: {
    width: 120,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  saveButton: {
    marginTop: 16,
  },
});

export default PhotosModal;
