import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useColors} from '../../hooks/hook.color';
import Text from '../ui/text';
import Button from '../ui/button';
import AppIcon from '../icons';
import Header from '../ui/header';

type CommentsModalProps = {
  visible: boolean;
  initialComment?: string;
  onClose: () => void;
  onSend: (comment: string) => Promise<void>;
  isLoading?: boolean;
};

const CommentsModal = ({
  visible,
  initialComment = '',
  onClose,
  onSend,
  isLoading,
}: CommentsModalProps) => {
  const colors = useColors();
  const [comment, setComment] = useState(initialComment);

  // Limpiar comentario cuando se cierra el modal
  useEffect(() => {
    if (!visible) {
      setComment(initialComment || '');
    }
  }, [visible, initialComment]);

  const handleTextChange = (text: string) => {
    setComment(text);
  };

  const handleSend = async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Por favor, escriba un comentario');
      return;
    }

    try {
      await onSend(comment);
      onClose();
    } catch (error) {
      // El error ya se maneja en onSend
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
              title="Comentarios"
              renderRight={
                <Pressable style={styles.closeButton} onPress={onClose}>
                  <AppIcon name="close" color={colors.black} size={24} />
                </Pressable>
              }
            />

            <ScrollView style={styles.content}>
              <View style={styles.instructions}>
                <Text style={styles.instructionText}>
                  Añade comentarios adicionales sobre la visita
                </Text>
              </View>

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
                  placeholder="Escriba sus comentarios aquí..."
                  placeholderTextColor="#999"
                  value={comment}
                  onChangeText={handleTextChange}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <Button
                style={styles.saveButton}
                disabled={!comment.trim() || isLoading}
                size="smMd"
                onPress={handleSend}>
                {isLoading ? 'Enviando...' : 'Enviar comentario'}
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardAvoidingView: {
    width: width * 0.85,
    maxWidth: 500,
    maxHeight: height * 0.8,
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
    maxHeight: height * 0.8,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 8,
    maxHeight: height * 0.6,
  },
  instructions: {
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 18,
    marginBottom: 8,
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    minHeight: 150,
  },
  buttonContainer: {
    marginTop: 16,
  },
  saveButton: {
    marginTop: 8,
  },
});

export default CommentsModal;
