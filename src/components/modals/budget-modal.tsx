import React, {useCallback, useState} from 'react';
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
} from 'react-native';
import {useColors} from '../../hooks/hook.color';
import Text from '../ui/text';
import Button from '../ui/button';
import AppIcon from '../icons';
import Header from '../ui/header';
import {screenW} from '../../theme/metrics';
import DocumentPicker, {pick} from '@react-native-documents/picker';

type BudgetModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (budgetText: string, documents: any) => void;
  initialBudget?: string;
};

const BudgetModal = ({
  visible,
  onClose,
  onSave,
  initialBudget,
}: BudgetModalProps) => {
  const colors = useColors();
  const [budgetText, setBudgetText] = useState(initialBudget || '');
  const [document, setDocument] = useState<any>();

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

  const handleSave = () => {
    if (!budgetText && document.length === 0) {
      Alert.alert(
        'Información requerida',
        'Por favor, ingresa texto en el presupuesto o sube al menos un documento.',
      );
      return;
    }

    onSave(budgetText, document);
    onClose();
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

              {/* Lista de documentos seleccionados */}
              {document ? (
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
              ) : (
                <>
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

                  <TouchableOpacity
                    style={[
                      styles.photoSourceButton,
                      {borderColor: colors.primary},
                    ]}
                    onPress={uploadFile}>
                    <AppIcon name="file" size={36} color={colors.primary} />
                    <Text color={colors.primary} fw="medium">
                      Subir documento
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>

            <Button style={styles.saveButton} size="smMd" onPress={handleSave}>
              Guardar presupuesto
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
    fontSize: 16,
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
    fontSize: 12,
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
    fontSize: 16,
    marginBottom: 8,
  },
  photoSourceButton: {
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
    fontSize: 14,
    fontWeight: '500',
  },
  documentSize: {
    fontSize: 12,
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
