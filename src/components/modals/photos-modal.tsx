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
import {useCameraPermission} from 'react-native-vision-camera';
import {screenW} from '../../theme/metrics';

type PhotosModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (photos: Asset[]) => void;
};

const PhotosModal = ({visible, onClose, onSave}: PhotosModalProps) => {
  const colors = useColors();
  const [photos, setPhotos] = useState<Asset[]>([]);
  const {hasPermission, requestPermission} = useCameraPermission();

  const selectImg = useCallback(() => {
    if (!hasPermission) {
      console.log('No permission');
      return requestPermission();
    }

    const options: any = {
      title: 'Selecciona una imagen',
      selectionLimit: 0,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, response => {
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
    });
  }, [hasPermission, requestPermission]);

  const takePicture = useCallback(() => {
    if (!hasPermission) {
      return requestPermission();
    }
    const options: any = {
      title: 'Tomar foto',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      includeBase64: true,
    };

    launchCamera(options, response => {
      if (response?.assets) {
        const file = convertToFormData(response.assets[0]);
        setPhotos(prevPhotos => [...prevPhotos, file]);
      }
    });
  }, [hasPermission, requestPermission]);

  const handleDelete = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  const handleSave = () => {
    if (photos.length === 0) {
      Alert.alert('Error', 'Por favor, agregue al menos una foto');
      return;
    }

    onSave(photos);
    onClose();
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
              onPress={handleSave}
              size="smMd"
              disabled={photos.length === 0}>
              Guardar fotos
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
    fontSize: 16,
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
