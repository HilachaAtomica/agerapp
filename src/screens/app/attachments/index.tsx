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
import Share from 'react-native-share';

const {width} = Dimensions.get('window');

type AttachmentsScreenProps = {
  navigation: any;
  route: {
    params: {
      archivosVisibles?: ArchivoVisible[];
      archivosFotos?: ArchivoVisible[];
      archivosPresupuestos?: ArchivoVisible[];
      archivosFirmas?: ArchivoVisible[];
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
    citaId,
    isDoneFromHistory
  } = route.params || {};
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

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

    // Para imágenes, abrir modal viewer
    if (isImageFile) {
      const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
      setSelectedImage(fullUrl);
      return;
    }

    // Para otros archivos, descargar y abrir con FileViewer
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

      // Ruta temporal para guardar el archivo
      const localFile = `${RNFS.CachesDirectoryPath}/${fileName}`;

      console.log('Downloading file:', {fullUrl, localFile, fileName, contentType, token: !!token});

      // Descargar el archivo con autenticación
      const downloadResult = await RNFS.downloadFile({
        fromUrl: fullUrl,
        toFile: localFile,
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      }).promise;

      if (downloadResult.statusCode === 200) {
        console.log('File downloaded successfully, opening...');
        
        try {
          // Usar react-native-share para abrir el archivo con intent chooser
          await Share.open({
            url: Platform.OS === 'android' ? `file://${localFile}` : localFile,
            type: contentType || 'application/*',
            title: 'Abrir con...',
            subject: fileName,
            failOnCancel: false,
          });
        } catch (shareError: any) {
          console.error('Share error:', shareError);
          
          // Si el usuario canceló, no mostrar error
          if (shareError.message === 'User did not share') {
            return;
          }
          
          Alert.alert(
            'Error',
            'No se pudo abrir el archivo. Intenta instalando una aplicación compatible como Google Drive o Adobe Reader.',
          );
        }
      } else {
        throw new Error(
          `Download failed with status: ${downloadResult.statusCode}`,
        );
      }
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert(
        'Error',
        'No se pudo abrir el archivo. Por favor, intenta de nuevo.',
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

  const totalFiles = (archivosVisibles?.length || 0) + (archivosFotos?.length || 0) + (archivosPresupuestos?.length || 0) + (archivosFirmas?.length || 0);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}} edges={['top', 'bottom']}>
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
          </>
        )}
      </ScrollView>

      <ImageViewerModal
        visible={selectedImage !== null}
        imageUrl={selectedImage || ''}
        onClose={() => setSelectedImage(null)}
      />
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
});

export default AttachmentsScreen;
