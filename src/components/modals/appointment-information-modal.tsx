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
  ActivityIndicator,
} from 'react-native';
import {useColors} from '../../hooks/hook.color';
import Button from '../ui/button';
import {screenH, screenW} from '../../theme/metrics';
import Header from '../ui/header';
import Text from '../ui/text';
import * as NavigationUtil from '../../utils/utils.navigation';
import moment from 'moment';
import {Appointment, AppointmentDetail} from '../../models/calendar';
import AppIcon from '../icons';
import ContactItem from '../contact-item';
import {contacts} from '../../utils/utils.jsons';
import SignatureModal from './signature-modal';
import BudgetModal from './budget-modal';
import PhotosModal from './photos-modal';
import CommentsModal from './comments-modal';
import {Asset} from 'react-native-image-picker';
import {
  useUploadBudgetMutation,
  useUploadSignaturesMutation,
  useUploadCommentsMutation,
  useUploadPhotosMutation,
  useCloseCitaMutation,
  useGetAppointmentInfoQuery,
} from '../../redux/services/service.calendar';

export type AppointmentInformationModalMethods = {
  open: (appointment: {citaId: number; isDone?: boolean}) => void;
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
    documents?: any[];
  } | null>(null);
  const [photos, setPhotos] = useState<Asset[]>([]);
  const [comment, setComment] = useState<string>('');

  const [citaId, setCitaId] = useState<number | null>(null);
  const [isDoneFromHistory, setIsDoneFromHistory] = useState<boolean>(false);

  // Query para obtener información completa de la cita
  const {
    data: appointment,
    isLoading: loadingAppointment,
    error: errorAppointment,
  } = useGetAppointmentInfoQuery(citaId!, {
    skip: !citaId,
  });

  // Mutations para subir archivos
  const [uploadBudget, {isLoading: uploadingBudget}] =
    useUploadBudgetMutation();
  const [uploadSignatures, {isLoading: uploadingSignatures}] =
    useUploadSignaturesMutation();
  const [uploadComments, {isLoading: uploadingComments}] =
    useUploadCommentsMutation();
  const [uploadPhotos, {isLoading: uploadingPhotos}] =
    useUploadPhotosMutation();
  const [closeCita, {isLoading: closingCita}] = useCloseCitaMutation();

  // Helper function to format appointment data for display
  const getFormattedAppointment = () => {
    if (!appointment) return null;

    const endDate = moment(appointment.fechaCitaFin);
    const startDate = appointment.fechaCita
      ? moment(appointment.fechaCita)
      : null;

    return {
      subject: `${appointment.expedienteId}`,
      dateTimeInfo: startDate
        ? `Fecha inicio: ${startDate.format(
            'DD/MM/YYYY HH:mm',
          )}\nFecha fin: ${endDate.format('DD/MM/YYYY HH:mm')}`
        : `Fecha fin: ${endDate.format('DD/MM/YYYY HH:mm')}`,
      address: `${appointment.domicilioCliente}, ${appointment.localidadCliente}`,
      description: appointment.info,
      daysRemaining: (startDate || endDate).diff(
        moment().startOf('day'),
        'days',
      ),
    };
  };

  const formattedAppointment = getFormattedAppointment();

  // Determinar si la cita está lista (tiene todos los archivos necesarios)
  const isAppointmentReady = () => {
    if (!appointment) return false;
    // Si está marcada como finalizada desde el historial, está lista
    if (isDoneFromHistory) return true;
  };

  // Calcular días restantes basado en fechaCita
  const getDaysRemaining = () => {
    if (!appointment?.fechaCita) {
      // Si no hay fechaCita, usar fechaCitaFin
      const appointmentDate = moment(appointment?.fechaCitaFin);
      const today = moment().startOf('day');
      const daysRemaining = appointmentDate.diff(today, 'days');
      return daysRemaining >= 0 ? daysRemaining : 0;
    }
    const appointmentDate = moment(appointment.fechaCita);
    const today = moment().startOf('day');
    const daysRemaining = appointmentDate.diff(today, 'days');
    return daysRemaining >= 0 ? daysRemaining : 0;
  };

  // Función para obtener el estado basado en el contexto del modal
  const getCommingStatus = () => {
    if (!appointment) return null;

    const today = moment().startOf('day');
    const startDate = appointment.fechaCita
      ? moment(appointment.fechaCita).startOf('day')
      : null;
    const endDate = moment(appointment.fechaCitaFin).startOf('day');

    // Si viene del historial, siempre mostrar "Finalizada"
    if (isDoneFromHistory) {
      return {
        text: 'Finalizada',
        color: colors.green,
      };
    }

    // Determinar si es una cita pendiente (pasó la fecha fin)
    const isPending = today.isAfter(endDate);

    if (isPending) {
      const daysSinceEnd = today.diff(endDate, 'days');
      if (daysSinceEnd === 0) return {text: 'Pendiente hoy', color: colors.red};
      if (daysSinceEnd === 1)
        return {text: 'Pendiente hace 1 día', color: colors.red};
      return {text: `Pendiente hace ${daysSinceEnd} días`, color: colors.red};
    }

    // Lógica para citas en progreso o futuras
    if (startDate) {
      // Si estamos entre fecha inicio y fecha fin = EN CURSO
      if (today.isSame(startDate)) {
        return {
          text: 'Hoy',
          color: colors.green,
        };
      }
      if (today.isBetween(startDate, endDate, 'day', '[]')) {
        return {
          text: 'En curso',
          color: colors.green,
        };
      }

      // Si aún no empieza (fecha inicio futura) = DÍAS RESTANTES
      if (today.isBefore(startDate)) {
        const daysRemaining = startDate.diff(today, 'days');
        if (daysRemaining === 1) return {text: 'Mañana', color: colors.yellow};
        return {
          text: `${daysRemaining} días`,
          color: colors.yellow,
        };
      }
    }

    // Si no hay fecha inicio, usar solo fecha fin
    if (!startDate) {
      // Si aún no llega la fecha fin = DÍAS RESTANTES
      if (today.isBefore(endDate) || today.isSame(endDate)) {
        const daysRemaining = endDate.diff(today, 'days');
        if (daysRemaining === 0) return {text: 'Hoy', color: colors.green};
        if (daysRemaining === 1) return {text: 'Mañana', color: colors.yellow};
        return {
          text: `${daysRemaining} días`,
          color: colors.yellow,
        };
      }
    }

    // Fallback - nunca debería llegar aquí
    return {text: 'Error', color: colors.primary};
  };

  const getDaysRemainingColor = () => {
    const status = getCommingStatus();
    return status?.color || colors.primary;
  };

  const getDaysRemainingText = () => {
    const status = getCommingStatus();
    return status?.text || '';
  };
  const isDone = useMemo(() => {
    return formattedAppointment?.daysRemaining === 0;
  }, [formattedAppointment]);

  const handleOpenMaps = useCallback(() => {
    if (formattedAppointment?.address) {
      // Codifica la dirección para URL
      const encodedAddress = encodeURIComponent(formattedAppointment.address);

      // Mostrar opciones para abrir en Maps o Waze
      Alert.alert(
        'Abrir dirección',
        '¿Con qué aplicación deseas abrir la dirección?',
        [
          {
            text: 'Google Maps',
            onPress: () => {
              const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
              Linking.openURL(googleMapsUrl).catch(err => {
                console.error('Error al abrir Google Maps:', err);
                Alert.alert('Error', 'No se pudo abrir Google Maps');
              });
            },
          },
          {
            text: 'Waze',
            onPress: () => {
              const wazeUrl = `waze://?q=${encodedAddress}`;
              Linking.canOpenURL(wazeUrl).then(supported => {
                if (supported) {
                  Linking.openURL(wazeUrl);
                } else {
                  // Si Waze no está instalado, abrir en la web
                  const wazeWebUrl = `https://www.waze.com/ul?q=${encodedAddress}&navigate=yes`;
                  Linking.openURL(wazeWebUrl).catch(err => {
                    console.error('Error al abrir Waze:', err);
                    Alert.alert('Error', 'Waze no está instalado');
                  });
                }
              });
            },
          },
          {
            text: 'Cancelar',
            style: 'cancel',
          },
        ],
      );
    }
  }, [formattedAppointment]);

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

  const handleSendBudget = async (budgetText: string, documents: any) => {
    if (!appointment) return;

    try {
      const formData = new FormData();

      // Si hay documentos, los agregamos al FormData
      if (documents) {
        if (Array.isArray(documents)) {
          documents.forEach((doc: any, index: number) => {
            if (doc.uri && doc.name && doc.type) {
              formData.append('files', {
                uri: doc.uri,
                type: doc.type,
                name: doc.name,
              } as any);
            }
          });
        } else if (documents.uri && documents.name && documents.type) {
          // Si es un solo documento (foto)
          formData.append('files', {
            uri: documents.uri,
            type: documents.type,
            name: documents.name,
          } as any);
        }

        await uploadBudget({
          citaId: appointment.citaId,
          files: formData,
        }).unwrap();

        setBudget({text: budgetText, documents});
        Alert.alert('Éxito', 'Presupuesto enviado correctamente');
      } else {
        // Si solo hay texto, lo guardamos localmente
        setBudget({text: budgetText, documents});
        Alert.alert(
          'Información',
          'Texto del presupuesto guardado localmente. Para enviarlo al servidor, adjunte un archivo o foto.',
        );
      }
    } catch (error) {
      console.error('Error al enviar presupuesto:', error);
      Alert.alert('Error', 'No se pudo enviar el presupuesto');
      throw error;
    }
  };

  const handleOpenPhotosModal = () => {
    setPhotosModalVisible(true);
  };

  const handleClosePhotosModal = () => {
    setPhotosModalVisible(false);
  };

  const handleSendPhotos = async (selectedPhotos: any[]) => {
    if (!appointment || selectedPhotos.length === 0) return;

    console.log('handleSendPhotos called with:', selectedPhotos);

    try {
      const formData = new FormData();

      selectedPhotos.forEach((photo, index) => {
        if (photo.uri && (photo.fileName || photo.name) && photo.type) {
          formData.append('files', {
            uri: photo.uri,
            type: photo.type,
            name: photo.fileName || photo.name,
          } as any);
        }
      });

      await uploadPhotos({
        citaId: appointment.citaId,
        files: formData,
      }).unwrap();

      setPhotos(selectedPhotos);
      Alert.alert('Éxito', 'Fotos enviadas correctamente');
    } catch (error) {
      console.error('Error al enviar fotos:', error);
      Alert.alert('Error', 'No se pudieron enviar las fotos');
      throw error; // Re-lanza el error para que el modal lo maneje
    }
  };

  const handleOpenCommentsModal = () => {
    setCommentsModalVisible(true);
  };

  const handleCloseCommentsModal = () => {
    setCommentsModalVisible(false);
  };

  const handleSendComments = async (text: string) => {
    if (!appointment || !text.trim()) return;

    try {
      await uploadComments({
        citaId: appointment.citaId,
        texto: text,
      }).unwrap();

      setComment(text);
      Alert.alert('Éxito', 'Comentario enviado correctamente');
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      Alert.alert('Error', 'No se pudo enviar el comentario');
      throw error;
    }
  };

  const handleSendSignature = async (signatureData: string) => {
    if (!appointment || !signatureData) return;

    try {
      const formData = new FormData();

      // Convertir base64 a blob y agregar al FormData
      const timestamp = Date.now();
      formData.append('files', {
        uri: signatureData,
        type: 'image/png',
        name: `firma_${timestamp}.png`,
      } as any);

      await uploadSignatures({
        citaId: appointment.citaId,
        files: formData,
      }).unwrap();

      setSignature(signatureData);
      Alert.alert('Éxito', 'Firma enviada correctamente');
    } catch (error) {
      console.error('Error al enviar firma:', error);
      Alert.alert('Error', 'No se pudo enviar la firma');
      throw error;
    }
  };

  const handleCloseCita = async () => {
    if (!appointment) return;

    Alert.alert(
      'Cerrar Cita',
      '¿Estás seguro de que deseas cerrar esta cita? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Cita',
          style: 'destructive',
          onPress: async () => {
            try {
              await closeCita(appointment.citaId).unwrap();
              Alert.alert('Éxito', 'Cita cerrada correctamente');
              setModalVisible(false);
            } catch (error) {
              console.error('Error al cerrar cita:', error);
              Alert.alert('Error', 'No se pudo cerrar la cita');
            }
          },
        },
      ],
    );
  };

  const handleOpen = useCallback(
    (appointmentData?: {citaId: number; isDone?: boolean}) => {
      console.log('handleOpen llamado con appointmentData:', appointmentData);
      if (appointmentData?.citaId) {
        setCitaId(appointmentData.citaId);
        setIsDoneFromHistory(appointmentData.isDone || false);
      }
      setModalVisible(true);
      console.log('Modal visible establecido a true');
    },
    [],
  );

  const handleClose = useCallback(() => {
    setModalVisible(false);
    setCitaId(null);
    setIsDoneFromHistory(false);
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
            title={formattedAppointment?.subject}
            renderRight={
              <Pressable style={styles.closeContainer} onPress={handleClose}>
                <AppIcon name="close" color={colors.black} size={24} />
              </Pressable>
            }
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {loadingAppointment ? (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, {color: colors.grey}]}>
                  Cargando información de la cita...
                </Text>
              </View>
            ) : errorAppointment ? (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, {color: colors.red}]}>
                  Error al cargar la información de la cita
                </Text>
              </View>
            ) : (
              <>
                <Text
                  style={[styles.statusText, {color: getDaysRemainingColor()}]}>
                  {getDaysRemainingText()}
                </Text>

                <View style={styles.infoContainer}>
                  <View style={[styles.dateTimeRow]}>
                    <AppIcon name="calendar" size={24} color={colors.grey} />
                    <Text style={styles.dateTimeText}>
                      {formattedAppointment?.dateTimeInfo}
                    </Text>
                  </View>

                  <Pressable
                    style={{flexDirection: 'row', gap: 6}}
                    onPress={handleOpenMaps}>
                    <AppIcon name="location" size={20} color={colors.primary} />
                    <Text fw="medium" color={colors.primary}>
                      {formattedAppointment?.address}
                    </Text>
                  </Pressable>

                  <View style={[styles.descriptionRow]}>
                    <Text fw="semibold">Descripción:</Text>
                    <Text>{formattedAppointment?.description}</Text>
                  </View>

                  {appointment?.contactos &&
                    appointment.contactos.length > 0 && (
                      <View style={styles.contactsSection}>
                        <Text fw="bold" style={styles.contactsTitle}>
                          Contactos
                        </Text>
                        <FlatList
                          data={appointment.contactos}
                          horizontal
                          style={{padding: 6}}
                          showsHorizontalScrollIndicator={false}
                          renderItem={({item}) => (
                            <View style={styles.contactItemHorizontal}>
                              <View style={styles.contactItem}>
                                <Text fw="semibold">{item.nombre}</Text>
                                {item.telefono ? (
                                  <Pressable
                                    style={styles.phoneButton}
                                    onPress={() => {
                                      const phoneNumber = item.telefono.replace(
                                        /[^\d+]/g,
                                        '',
                                      );
                                      Linking.openURL(
                                        `tel:${phoneNumber}`,
                                      ).catch(err => {
                                        console.error(
                                          'Error al realizar llamada:',
                                          err,
                                        );
                                        Alert.alert(
                                          'Error',
                                          'No se pudo realizar la llamada',
                                        );
                                      });
                                    }}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 4,
                                      }}>
                                      <AppIcon
                                        name="phone"
                                        size={14}
                                        color={colors.primary}
                                      />
                                      <Text
                                        style={{color: colors.primary}}
                                        fw="medium">
                                        {item.telefono}
                                      </Text>
                                    </View>
                                  </Pressable>
                                ) : (
                                  <Text style={{color: colors.grey}}>
                                    Sin teléfono
                                  </Text>
                                )}
                                <Text>{item.contactoRol}</Text>
                                {item.piso && <Text>Piso: {item.piso}</Text>}
                              </View>
                            </View>
                          )}
                          keyExtractor={item => item.contactoId.toString()}
                          contentContainerStyle={styles.horizontalContactsList}
                        />
                      </View>
                    )}
                </View>

                <View style={{gap: 12}}>
                  <Pressable
                    style={[
                      styles.actionContainer,
                      {borderBottomColor: colors.primary},
                    ]}
                    onPress={handleOpenBudgetModal}>
                    <Text style={{fontSize: 18}}>Presupuesto</Text>
                    <AppIcon
                      name={
                        appointment?.tienePresupuesto || budget
                          ? 'check'
                          : 'plus'
                      }
                      color={colors.primary}
                    />
                  </Pressable>

                  <Pressable
                    style={[
                      styles.actionContainer,
                      {borderBottomColor: colors.primary},
                    ]}
                    onPress={handleOpenPhotosModal}>
                    <Text style={{fontSize: 18}}>Fotos</Text>
                    <AppIcon
                      name={
                        appointment?.tieneFotos || photos.length > 0
                          ? 'check'
                          : 'plus'
                      }
                      color={colors.primary}
                    />
                  </Pressable>

                  <Pressable
                    style={[
                      styles.actionContainer,
                      {borderBottomColor: colors.primary},
                    ]}
                    onPress={handleOpenCommentsModal}>
                    <Text style={{fontSize: 18}}>Comentarios</Text>
                    <AppIcon
                      name={
                        appointment?.tieneComentarios || comment
                          ? 'check'
                          : 'plus'
                      }
                      color={colors.primary}
                    />
                  </Pressable>

                  <Pressable
                    style={[
                      styles.actionContainer,
                      {borderBottomColor: colors.primary},
                    ]}
                    onPress={handleOpenSignatureModal}>
                    <Text style={{fontSize: 18}}>Firmas</Text>
                    <AppIcon
                      name={
                        appointment?.tieneFirmas || signature ? 'check' : 'plus'
                      }
                      color={colors.primary}
                    />
                  </Pressable>
                </View>
              </>
            )}
          </ScrollView>

          {!isDoneFromHistory && (
            <Button
              size="smMd"
              style={{marginTop: 24}}
              disabled={closingCita}
              onPress={handleCloseCita}
              color={colors.primary}>
              {closingCita ? 'Cerrando...' : 'Cerrar cita'}
            </Button>
          )}
        </View>
      </Modal>
      <BudgetModal
        visible={budgetModalVisible}
        onClose={handleCloseBudgetModal}
        onSend={handleSendBudget}
        isLoading={uploadingBudget}
      />

      <PhotosModal
        visible={photosModalVisible}
        onClose={handleClosePhotosModal}
        onSend={handleSendPhotos}
        isLoading={uploadingPhotos}
      />

      <CommentsModal
        visible={commentsModalVisible}
        initialComment={comment}
        onClose={handleCloseCommentsModal}
        onSend={handleSendComments}
        isLoading={uploadingComments}
      />
      <SignatureModal
        visible={signatureModalVisible}
        onClose={handleCloseSignatureModal}
        onSend={handleSendSignature}
        isLoading={uploadingSignatures}
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
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
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
    fontSize: 20,
    marginBottom: 12,
  },
  horizontalContactsList: {
    paddingRight: 16,
  },
  contactItemHorizontal: {
    marginRight: 12,
  },
  contactItem: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    minWidth: 120,
  },
  phoneButton: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 4,
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
    fontSize: 20,
    marginBottom: 8,
  },
  signatureImage: {
    borderWidth: 1,
    height: 150,
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
  },
  statusContainer: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dateTimeText: {
    flex: 1,
    lineHeight: 20,
  },
});
