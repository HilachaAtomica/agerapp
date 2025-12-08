import React, {useRef, useState, useEffect} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import {useColors} from '../../hooks/hook.color';
import Text from '../ui/text';
import Button from '../ui/button';
import AppIcon from '../icons';
import Header from '../ui/header';
import SignatureCanvas, {SignatureViewRef} from 'react-native-signature-canvas';
import {screenH, screenW} from '../../theme/metrics';

type SignatureModalProps = {
  visible: boolean;
  onClose: () => void;
  onSend: (signature: string) => Promise<void>;
  isLoading?: boolean;
};

const SignatureModal = ({
  visible,
  onClose,
  onSend,
  isLoading,
}: SignatureModalProps) => {
  const colors = useColors();
  const signatureRef = useRef<SignatureViewRef>(null);
  const [signatureExists, setSignatureExists] = useState(false);

  // Limpiar firma cuando se cierra el modal
  useEffect(() => {
    if (!visible) {
      try {
        signatureRef.current?.clearSignature();
      } catch (e) {
        // ignore
      }
      setSignatureExists(false);
    }
  }, [visible]);

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setSignatureExists(false);
  };

  const handleSave = () => {
    if (signatureRef.current) {
      signatureRef.current?.readSignature();
    }
  };

  const handleEnd = () => {
    // Actualizar estado cuando se termina la firma
    setSignatureExists(true);
  };

  const style = `.m-signature-pad {box-shadow: none; border: none; } 
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
                width: 100%; height: 100%;
              }`;

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.container,
            {backgroundColor: colors.white, shadowColor: colors.black},
          ]}>
          <Header
            title="Firma"
            renderRight={
              <Pressable style={styles.closeButton} onPress={onClose}>
                <AppIcon name="close" color={colors.black} size={24} />
              </Pressable>
            }
          />

          <View style={styles.signatureContainer}>
            <Text style={styles.instructions}>
              Por favor, firme a continuación para confirmar el servicio:
            </Text>

            <View style={[styles.canvasContainer, {borderColor: colors.grey}]}>
              <SignatureCanvas
                ref={signatureRef}
                onOK={async signature => {
                  try {
                    await onSend(signature);
                    onClose();
                  } catch (error) {
                    // El error ya se maneja en onSend
                  }
                }}
                onBegin={handleEnd}
                onEmpty={() => setSignatureExists(false)}
                descriptionText=""
                clearText="Limpiar"
                confirmText={isLoading ? 'Enviando...' : 'Enviar'}
                webStyle={style}
                penColor={colors.black}
              />
            </View>

            <View style={styles.actionButtons}>
              <Button size="smMd" style={styles.button} onPress={handleClear}>
                Limpiar
              </Button>

              <Button
                size="smMd"
                style={styles.button}
                onPress={handleSave}
                disabled={!signatureExists}>
                Guardar firma
              </Button>
            </View>
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
    maxHeight: screenH * 0.8,
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
  signatureContainer: {
    padding: 8,
  },
  instructions: {
    marginBottom: 16,
    fontSize: 18,
  },
  canvasContainer: {
    height: 220,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
  },
});

export default SignatureModal;
