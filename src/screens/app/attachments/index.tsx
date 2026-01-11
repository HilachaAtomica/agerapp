import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
  ActivityIndicator,
  Linking,
  Platform,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useColors} from '../../../hooks/hook.color';
import Header from '../../../components/ui/header';
import Text from '../../../components/ui/text';
import AppIcon from '../../../components/icons';
import {ArchivoVisible} from '../../../models/calendar';
import {useState, useEffect} from 'react';
import {openAppointmentInformationModal} from '../../../utils/utils.global';
import {API_URL, ACCESS_TOKEN_KEY} from '../../../constants/constants.api';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ImageViewerModal} from '../../../components/modals/image-viewer-modal';
import FastImage from 'react-native-fast-image';

const {width} = Dimensions.get('window');

type AttachmentsScreenProps = {
  navigation: any;
  route: {
    params: {
      archivosVisibles?: ArchivoVisible[];
      archivosFotos?: ArchivoVisible[];
      archivosPresupuestos?: ArchivoVisible[];
      archivosFirmas?: ArchivoVisible[];
      archivosComentarios?: ArchivoVisible[];
      citaId?: number;
      isDoneFromHistory?: boolean;
    };
  };
};

const AttachmentsScreen = ({navigation, route}: AttachmentsScreenProps) => {
  const colors = useColors();
  const {
    archivosVisibles = [], 
    archivosFotos = [], 
    archivosPresupuestos = [],
    archivosFirmas = [],
    archivosComentarios = [],
    citaId,
    isDoneFromHistory
  } = route.params || {};
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [txtContent, setTxtContent] = useState<string | null>(null);
  const [txtFileName, setTxtFileName] = useState<string>('');

  // Cargar token al montar
  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      setAuthToken(token);
    };
    loadToken();
  }, []);

  // Al desmontar el componente (cuando se va para atrás), reabrir el modal si hay citaId
  useEffect(() => {
    return () => {
      if (citaId) {
        setTimeout(() => {
          openAppointmentInformationModal(citaId, isDoneFromHistory);
        }, 300);
      }
    };
  }, [citaId, isDoneFromHistory]);

  const handleOpenFile = async (url: string, name: string, contentType: string) => {
    const isImageFile = isImage(contentType);
    const isPdfFile = contentType?.includes('pdf') || name?.toLowerCase().endsWith('.pdf');
    const isVideoFile = contentType?.startsWith('video/') || name?.toLowerCase().match(/\.(mp4|avi|mov|wmv|mkv)$/);
    const isTxtFile = contentType?.includes('text') || name?.toLowerCase().endsWith('.txt');

    // Para imágenes, abrir modal viewer
    if (isImageFile) {
      const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
      setSelectedImage(fullUrl);
      return;
    }

    // Para archivos TXT, mostrar el contenido en un modal
    if (isTxtFile) {
      try {
        setDownloadingFile(url);
        const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
        const fileName = name || decodeURIComponent(url.split('/').pop() || 'file.txt');

        // Obtener el contenido directamente sin descargar
        const response = await fetch(fullUrl, {
          headers: token ? {Authorization: `Bearer ${token}`} : undefined,
        });

        if (response.ok) {
          const content = await response.text();
          setTxtFileName(fileName);
          setTxtContent(content);
        } else {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
      } catch (error) {
        console.error('Error reading txt file:', error);
        Alert.alert('Error', 'No se pudo leer el archivo de texto.');
      } finally {
        setDownloadingFile(null);
      }
      return;
    }

    // Para PDFs y videos, descargar y que aparezca en notificaciones
    try {
      setDownloadingFile(url);

      const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;

      // Extraer el nombre del archivo de la URL o usar el proporcionado
      let fileName = name || decodeURIComponent(url.split('/').pop() || 'file');
      
      // Asegurarse de que el archivo tenga la extensión correcta basándose en contentType
      if (!fileName.includes('.') && contentType) {
        const extension = contentType.split('/')[1];
        fileName = `${fileName}.${extension}`;
      }

      // Todos los archivos se descargan a Downloads
      const targetDir = RNFS.DownloadDirectoryPath;
      const localFile = `${targetDir}/${fileName}`;

      console.log('Downloading file:', {fullUrl, localFile, fileName, contentType, token: !!token, isPdf: isPdfFile, isVideo: isVideoFile});

      // Descargar el archivo con autenticación y opciones para notificación
      const downloadResult = await RNFS.downloadFile({
        fromUrl: fullUrl,
        toFile: localFile,
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
        background: true,
        progressDivider: 1,
        begin: (res) => {
          console.log('Download has begun');
        },
        progress: (res) => {
          const progress = (res.bytesWritten / res.contentLength) * 100;
          console.log(`Progress: ${progress.toFixed(2)}%`);
        }
      }).promise;

      if (downloadResult.statusCode === 200) {
        console.log('File downloaded successfully to:', localFile);
        
        // Notificar al usuario que la descarga está completa con opción de abrir carpeta
        Alert.alert(
          'Descarga completada',
          `El archivo "${fileName}" se ha guardado en la carpeta Descargas.`,
          [
            {
              text: 'Abrir Descargas',
              onPress: () => {
                if (Platform.OS === 'android') {
                  // Intent para abrir el gestor de archivos en la carpeta Downloads
                  Linking.openURL('content://com.android.externalstorage.documents/document/primary:Download')
                    .catch(() => {
                      // Fallback: intentar abrir el gestor de archivos genérico
                      Linking.openURL('content://com.android.documentsui/.picker.PickActivity')
                        .catch(() => {
                          // Último fallback
                          Alert.alert('Información', 'Abre tu gestor de archivos y busca la carpeta "Descargas"');
                        });
                    });
                } else {
                  Alert.alert('Información', 'Busca el archivo en la app Archivos');
                }
              },
            },
            {
              text: 'OK',
              style: 'cancel',
            },
          ]
        );
      } else {
        throw new Error(
          `Download failed with status: ${downloadResult.statusCode}`,
        );
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert(
        'Error',
        'No se pudo descargar el archivo. Por favor, intenta de nuevo.',
      );
    } finally {
      setDownloadingFile(null);
    }
  };

  const isImage = (contentType: string) => {
    return contentType?.startsWith('image/');
  };

  const getFileSize = (size: number) => {
    if (!size || size <= 0) return 'Tamaño desconocido';
    if (size < 1024) return `${size} B`;
    return `${(size / 1024).toFixed(1)} KB`;
  };

  const getFileIcon = (contentType: string, name: string) => {
    if (contentType?.startsWith('image/')) return 'camera';
    if (contentType?.includes('pdf') || name?.toLowerCase().endsWith('.pdf')) return 'file';
    if (contentType?.includes('word') || name?.toLowerCase().match(/\.(doc|docx)$/)) return 'file';
    if (contentType?.includes('excel') || name?.toLowerCase().match(/\.(xls|xlsx)$/)) return 'file';
    return 'file';
  };

  const handleImageError = (fileUrl: string) => {
    console.error('Error loading image:', fileUrl);
    setImageErrors(prev => ({...prev, [fileUrl]: true}));
  };

  const renderFileSection = (title: string, files: ArchivoVisible[], iconName: string) => {
    if (!files || files.length === 0) return null;

    console.log(`[${title}] Files:`, files);

    return (
      <View style={styles.section}>
        <Text fw="bold" style={styles.sectionTitle}>
          {title}
        </Text>
        <View style={styles.fileGrid}>
          {files.map((file, index) => {
            const hasError = imageErrors[file.url];
            const shouldShowImage = isImage(file.contentType) && !hasError;
            const fullUrl = file.url.startsWith('http')
              ? file.url
              : `${API_URL}${file.url}`;
            const isDownloading = downloadingFile === file.url;

            return (
              <Pressable
                key={index}
                style={styles.fileCard}
                onPress={() => handleOpenFile(file.url, file.name, file.contentType)}
                disabled={isDownloading}>
                {shouldShowImage ? (
                  <FastImage
                    source={{
                      uri: fullUrl,
                      headers: authToken ? {Authorization: `Bearer ${authToken}`} : undefined,
                      priority: FastImage.priority.normal,
                    }}
                    style={styles.imagePreview}
                    onError={() => handleImageError(file.url)}
                  />
                ) : (
                  <View
                    style={[
                      styles.filePlaceholder,
                      {backgroundColor: colors.grey + '20'},
                    ]}>
                    {isDownloading ? (
                      <ActivityIndicator size="large" color={colors.primary} />
                    ) : (
                      <AppIcon
                        name={getFileIcon(file.contentType, file.name)}
                        size={40}
                        color={colors.primary}
                      />
                    )}
                  </View>
                )}
                <View style={styles.fileInfo}>
                  <Text fw="medium" numberOfLines={2} style={styles.fileName}>
                    {file.name}
                  </Text>
                  <Text color={colors.grey} style={styles.fileSize}>
                    {isDownloading ? 'Descargando...' : getFileSize(file.size)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  const totalFiles = (archivosVisibles?.length || 0) + (archivosFotos?.length || 0) + (archivosPresupuestos?.length || 0) + (archivosFirmas?.length || 0) + (archivosComentarios?.length || 0);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}} edges={['top', 'bottom']}>
      <Header title="Archivos adjuntos" goBack={navigation.goBack} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {totalFiles === 0 ? (
          <View style={styles.emptyContainer}>
            <AppIcon name="file" size={60} color={colors.grey} />
            <Text color={colors.grey} style={styles.emptyText}>
              No hay archivos adjuntos
            </Text>
          </View>
        ) : (
          <>
            {renderFileSection('Archivos Visibles', archivosVisibles, 'file')}
            {renderFileSection('Fotos', archivosFotos, 'camera')}
            {renderFileSection('Presupuestos', archivosPresupuestos, 'file')}
            {renderFileSection('Firmas', archivosFirmas, 'file')}
            {renderFileSection('Comentarios', archivosComentarios, 'file')}
          </>
        )}
      </ScrollView>

      <ImageViewerModal
        visible={selectedImage !== null}
        imageUrl={selectedImage || ''}
        onClose={() => setSelectedImage(null)}
      />

      {/* Modal para mostrar contenido de archivos TXT */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={txtContent !== null}
        onRequestClose={() => setTxtContent(null)}>
        <View style={styles.txtModalOverlay}>
          <View style={[styles.txtModalContainer, {backgroundColor: colors.white}]}>
            <View style={styles.txtModalHeader}>
              <Text fw="bold" style={styles.txtModalTitle}>
                {txtFileName}
              </Text>
              <Pressable
                style={styles.txtCloseButton}
                onPress={() => setTxtContent(null)}>
                <AppIcon name="close" size={24} color={colors.black} />
              </Pressable>
            </View>
            <ScrollView style={styles.txtModalContent}>
              <Text selectable style={styles.txtContent}>
                {txtContent}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  fileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  fileCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imagePreview: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  filePlaceholder: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileInfo: {
    padding: 12,
  },
  fileName: {
    fontSize: 14,
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
  },
  txtModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  txtModalContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  txtModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  txtModalTitle: {
    fontSize: 18,
    flex: 1,
  },
  txtCloseButton: {
    padding: 4,
  },
  txtModalContent: {
    padding: 16,
    maxHeight: '100%',
  },
  txtContent: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AttachmentsScreen;
