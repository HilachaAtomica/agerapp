import {
  Ref,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useColors} from '../../hooks/hook.color';
import Button from '../ui/button';
import {screenH, screenW} from '../../theme/metrics';
import Header from '../ui/header';
import Text from '../ui/text';
import * as NavigationUtil from '../../utils/utils.navigation';
import {Appointment} from '../../models/appointments';
import AppIcon from '../icons';
import ContactItem from '../contact-item';
import {contacts} from '../../utils/utils.jsons';
import SignatureModal from './signature-modal';
import BudgetModal from './budget-modal';
import PhotosModal from './photos-modal';
import CommentsModal from './comments-modal';
import {Asset} from 'react-native-image-picker';

export type AppointmentInformationModalMethods = {
  open: (appointment: Appointment) => void;
  close: () => void;
};

type AppointmentInformationModalProps = {};

const AppointmentInformationModal = (
  {}: AppointmentInformationModalProps,
  ref: Ref<AppointmentInformationModalMethods>,
) => {
  const [modalVisible, setModalVisible] = useState(false);
  const colors = useColors();
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [photosModalVisible, setPhotosModalVisible] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [budget, setBudget] = useState<{
    text?: string;
  } | null>(null);
  const [photos, setPhotos] = useState<Asset[]>([]);
  const [comment, setComment] = useState<string>('');

  const [appointment, setAppointment] = useState<Appointment>();

  const getDaysRemainingColor = () => {
    if (appointment?.daysRemaining && appointment?.daysRemaining <= 3)
      return colors.red;
    if (appointment?.daysRemaining && appointment?.daysRemaining <= 7)
      return colors.yellow;
    return colors.green;
  };

  const getDaysRemainingText = () => {
    if (appointment?.daysRemaining === 0) return 'Hecho';
    if (appointment?.daysRemaining === 1) return 'Mañana';
    return `${appointment?.daysRemaining} días`;
  };
  const isDone = useMemo(() => {
    return appointment?.daysRemaining === 0;
  }, [appointment]);

  const handleOpenMaps = useCallback(() => {
    if (appointment?.address) {
      // Codifica la dirección para URL
      const encodedAddress = encodeURIComponent(appointment.address);

      // URL para Google Maps (funciona en ambas plataformas)
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

      // Abre Google Maps o navegador web
      Linking.openURL(googleMapsUrl).catch(err => {
        console.error('Error al abrir el mapa:', err);
        // Si falla, intentamos abrir en el navegador
        Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`).catch(
          err => console.error('Error al abrir mapa en navegador:', err),
        );
      });
    }
  }, [appointment]);

  const handleOpenSignatureModal = () => {
    setSignatureModalVisible(true);
  };

  const handleCloseSignatureModal = () => {
    setSignatureModalVisible(false);
  };

  const handleOpenBudgetModal = () => {
    setBudgetModalVisible(true);
  };

  const handleCloseBudgetModal = () => {
    setBudgetModalVisible(false);
  };

  const handleSaveBudget = (data: {text?: string}) => {
    setBudget(data);
    console.log('Presupuesto guardado:', data);
  };

  const handleOpenPhotosModal = () => {
    setPhotosModalVisible(true);
  };

  const handleClosePhotosModal = () => {
    setPhotosModalVisible(false);
  };

  const handleSavePhotos = (selectedPhotos: Asset[]) => {
    setPhotos(selectedPhotos);
    console.log('Fotos guardadas:', selectedPhotos);
  };

  const handleOpenCommentsModal = () => {
    setCommentsModalVisible(true);
  };

  const handleCloseCommentsModal = () => {
    setCommentsModalVisible(false);
  };

  const handleSaveComment = (text: string) => {
    setComment(text);
    console.log('Comentario guardado:', text);
  };

  const handleSaveSignature = (signatureData: string) => {
    setSignature(signatureData);

    console.log('Firma guardada:', signatureData);
  };

  const handleOpen = useCallback((appointment?: any) => {
    if (appointment) {
      setAppointment(appointment);
    }
    setModalVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalVisible(false);
    setAppointment(undefined);
  }, []);

  useImperativeHandle(ref, () => ({
    open: handleOpen,
    close: handleClose,
  }));

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={[styles.main, {backgroundColor: colors.white}]}>
          <Header
            title={appointment?.subject}
            renderRight={
              <Pressable style={styles.closeContainer} onPress={handleClose}>
                <AppIcon name="close" color={colors.black} size={24} />
              </Pressable>
            }
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={[styles.subtitle]}
              color={getDaysRemainingColor()}
              fw="semibold">
              {getDaysRemainingText()}
            </Text>

            <View style={styles.infoContainer}>
              <View style={[styles.infoRow]}>
                <View style={styles.row}>
                  <AppIcon name="calendar" size={20} color={colors.grey} />
                  <Text>{appointment?.date}</Text>
                </View>

                <View style={styles.row}>
                  <AppIcon name="clock" size={20} color={colors.grey} />
                  <Text>{appointment?.time}</Text>
                </View>
              </View>

              <Pressable
                style={{flexDirection: 'row', gap: 6}}
                onPress={handleOpenMaps}>
                <AppIcon name="location" size={20} color={colors.primary} />
                <Text fw="medium" color={colors.primary}>
                  {appointment?.address}
                </Text>
              </Pressable>

              <View style={[styles.descriptionRow]}>
                <Text fw="semibold">Descripción:</Text>
                <Text>{appointment?.description}</Text>
              </View>

              {signature && (
                <View>
                  <Text fw="bold" style={styles.sectionTitle}>
                    Firma
                  </Text>
                  <Image
                    source={{uri: signature}}
                    style={[styles.signatureImage, {borderColor: colors.grey}]}
                    resizeMode="contain"
                  />
                </View>
              )}

              <View style={styles.contactsSection}>
                <Text fw="bold" style={styles.contactsTitle}>
                  Contactos
                </Text>
                <FlatList
                  data={contacts}
                  horizontal
                  style={{padding: 6}}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => (
                    <View style={styles.contactItemHorizontal}>
                      <ContactItem
                        contact={item}
                        onPress={() =>
                          console.log(`Contacto seleccionado: ${item.name}`)
                        }
                      />
                    </View>
                  )}
                  keyExtractor={item => item.id.toString()}
                  contentContainerStyle={styles.horizontalContactsList}
                />
              </View>
            </View>

            <View style={{gap: 12}}>
              <Pressable
                style={[
                  styles.actionContainer,
                  {borderBottomColor: colors.primary},
                ]}
                onPress={handleOpenBudgetModal}>
                <Text style={{fontSize: 16}}>
                  Presupuesto {budget ? '(1)' : ''}
                </Text>
                <AppIcon
                  name={budget ? 'check' : 'plus'}
                  color={colors.primary}
                />
              </Pressable>

              <Pressable
                style={[
                  styles.actionContainer,
                  {borderBottomColor: colors.primary},
                ]}
                onPress={handleOpenPhotosModal}>
                <Text style={{fontSize: 16}}>
                  Fotos {photos.length > 0 ? `(${photos.length})` : ''}
                </Text>
                <AppIcon
                  name={photos.length > 0 ? 'check' : 'plus'}
                  color={colors.primary}
                />
              </Pressable>

              <Pressable
                style={[
                  styles.actionContainer,
                  {borderBottomColor: colors.primary},
                ]}
                onPress={handleOpenCommentsModal}>
                <Text style={{fontSize: 16}}>
                  Comentarios {comment ? '(1)' : ''}
                </Text>
                <AppIcon
                  name={comment ? 'check' : 'plus'}
                  color={colors.primary}
                />
              </Pressable>
            </View>
          </ScrollView>
          <Button
            size="smMd"
            style={{marginTop: 24}}
            onPress={handleOpenSignatureModal}>
            Firmar
          </Button>
        </View>
      </Modal>
      <BudgetModal
        visible={budgetModalVisible}
        onClose={handleCloseBudgetModal}
      />

      <PhotosModal
        visible={photosModalVisible}
        onClose={handleClosePhotosModal}
        onSave={handleSavePhotos}
      />

      <CommentsModal
        visible={commentsModalVisible}
        initialComment={comment}
        onClose={handleCloseCommentsModal}
        onSave={handleSaveComment}
      />
      <SignatureModal
        visible={signatureModalVisible}
        onClose={handleCloseSignatureModal}
        onSave={handleSaveSignature}
      />
      {!!modalVisible && <View style={styles.actionsBackground} />}
    </>
  );
};

export default forwardRef(AppointmentInformationModal);

const styles = StyleSheet.create({
  main: {
    marginTop: 'auto',
    maxHeight: '90%',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  actionsBackground: {
    position: 'absolute',
    backgroundColor: '#00000080',
    height: screenH,
    width: screenW,
    zIndex: 2,
  },
  closeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-end',
  },
  infoContainer: {
    marginTop: 24,
    gap: 16,
    paddingBottom: 20,
  },
  infoColumn: {
    flex: 1,
    marginHorizontal: 8,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'space-between',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
  },
  descriptionRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 8,
    gap: 6,
  },
  contactsSection: {
    marginTop: 16,
  },
  contactsTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  horizontalContactsList: {
    paddingRight: 16,
  },
  contactItemHorizontal: {
    marginRight: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    paddingBottom: 6,
  },
  signaturePreview: {
    marginTop: 24,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  signatureImage: {
    borderWidth: 1,
    height: 150,
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
});
