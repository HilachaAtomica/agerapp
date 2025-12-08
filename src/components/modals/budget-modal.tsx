import React, {useCallback, useState, useEffect} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Alert,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import {useColors} from '../../hooks/hook.color';
import Text from '../ui/text';
import Button from '../ui/button';
import AppIcon from '../icons';
import Header from '../ui/header';
import {screenW} from '../../theme/metrics';
import DocumentPicker, {pick} from '@react-native-documents/picker';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';

type BudgetModalProps = {
  visible: boolean;
  onClose: () => void;
  onSend: (budgetText: string, documents: any) => Promise<void>;
  initialBudget?: string;
  isLoading?: boolean;
};

const BudgetModal = ({
  visible,
  onClose,
  onSend,
  initialBudget,
  isLoading,
}: BudgetModalProps) => {
  const colors = useColors();
  const [budgetText, setBudgetText] = useState(initialBudget || '');
  const [document, setDocument] = useState<any>();

  // Limpiar estado cuando se cierra el modal
  useEffect(() => {
    if (!visible) {
      setBudgetText(initialBudget || '');
      setDocument(undefined);
    }
  }, [visible, initialBudget]);

  const uploadFile = async () => {
    try {
      const [result] = await pick({
        mode: 'open',
      });
      console.log('Selected files:', result);
      setDocument(result);
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'No se pudo seleccionar el documento.');
    }
  };

  const removeDocument = (index: number) => {
    const newDocuments = [...document];
    newDocuments.splice(index, 1);
    setDocument(newDocuments);
  };

  const handleSend = async () => {
    if (!budgetText && (!document || document.length === 0)) {
      Alert.alert(
        'Información requerida',
        'Por favor, ingresa texto en el presupuesto o sube al menos un documento.',
      );
      return;
    }

    try {
      await onSend(budgetText, document);
      onClose();
    } catch (error) {
      // El error ya se maneja en onSend
    }
  };

  const takePhoto = async () => {
    try {
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
        const photoDocument = {
          uri: photo.uri,
          type: photo.type,
          name: photo.fileName || `photo_${Date.now()}.jpg`,
          size: photo.fileSize,
        };
        setDocument(photoDocument);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const selectFromGallery = async () => {
    try {
      const options: any = {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
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

      if (response?.assets && response.assets[0]) {
        const photo = response.assets[0];
        const photoDocument = {
          uri: photo.uri,
          type: photo.type,
          name: photo.fileName || `photo_${Date.now()}.jpg`,
          size: photo.fileSize,
        };
        setDocument(photoDocument);
      }
    } catch (error) {
      console.error('Error selecting from gallery:', error);
      Alert.alert('Error', 'No se pudo seleccionar la foto');
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}>
          <View
            style={[
              styles.container,
              {backgroundColor: colors.white, shadowColor: colors.black},
            ]}>
            <Header
              title="Presupuesto"
              renderRight={
                <Pressable style={styles.closeButton} onPress={onClose}>
                  <AppIcon name="close" color={colors.black} size={24} />
                </Pressable>
              }
            />

            <ScrollView>
              <View style={styles.instructions}>
                <Text style={styles.instructionText}>
                  Puedes escribir el presupuesto o subir un documento
                </Text>
              </View>

              {/* Text input always visible */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      borderColor: colors.grey,
                      color: colors.black,
                    },
                  ]}
                  multiline
                  numberOfLines={10}
                  placeholder="Escriba el presupuesto aquí..."
                  placeholderTextColor="#999"
                  value={budgetText}
                  onChangeText={setBudgetText}
                  textAlignVertical="top"
                />
              </View>

              <Text
                style={{marginVertical: 12, textAlign: 'center'}}
                fw="semibold">
                O
              </Text>

              {/* Lista de documentos seleccionados */}
              {document && (
                <View style={styles.documentsList}>
                  <View style={styles.documentItem}>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName}>{document?.name}</Text>
                      <Text style={styles.documentSize}>
                        {Math.round(document?.size / 1024)} KB
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => setDocument(null)}>
                      <AppIcon name="close" size={16} color={colors.black} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Document picker buttons always visible */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.photoSourceButton,
                    {borderColor: colors.primary},
                  ]}
                  onPress={uploadFile}>
                  <AppIcon name="file" size={36} color={colors.primary} />
                  <Text color={colors.primary} fw="medium">
                    Documento
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.photoSourceButton,
                    {borderColor: colors.primary},
                  ]}
                  onPress={takePhoto}>
                  <AppIcon name="camera" size={36} color={colors.primary} />
                  <Text color={colors.primary} fw="medium">
                    Cámara
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.photoSourceButton,
                    {borderColor: colors.primary},
                  ]}
                  onPress={selectFromGallery}>
                  <AppIcon name="gallery" size={36} color={colors.primary} />
                  <Text color={colors.primary} fw="medium">
                    Galería
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <Button
              style={styles.saveButton}
              size="smMd"
              onPress={handleSend}
              disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar presupuesto'}
            </Button>
          </View>
        </KeyboardAvoidingView>
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
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  inputContainer: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    minHeight: 150,
  },
  documentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  documentPreview: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedDocument: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  documentInfo: {
    marginLeft: 10,
    flex: 1,
  },
  placeholderText: {
    textAlign: 'center',
  },
  uploadButton: {
    marginBottom: 8,
  },
  fileTypesHint: {
    fontSize: 14,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 16,
  },
  keyboardAvoidingView: {
    width: screenW * 0.85,
  },
  instructions: {
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 18,
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  photoSourceButton: {
    flex: 1,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  documentsList: {
    marginVertical: 10,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '500',
  },
  documentSize: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BudgetModal;
