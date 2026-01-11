import { useCallback, useEffect, useState } from 'react';
import {
  LogLevel,
  NotificationClickEvent,
  NotificationWillDisplayEvent,
  OneSignal,
} from 'react-native-onesignal';
import Toast from 'react-native-toast-message';
import { openAppointmentInformationModal } from '../utils/utils.global';

// OneSignal App ID
const ONESIGNAL_APP_ID = '6dc9b19a-b382-497f-b6ae-62a816c1f23d';

export type UseOnesignalProps = {
  isEnabled?: boolean;
  username?: string;
};

export const useOnesignal = ({ isEnabled, username }: UseOnesignalProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const showInForegroundHandler = useCallback(
    (event: NotificationWillDisplayEvent) => {
      console.log('OneSignal: notification will show in foreground:', event);
      const notification = event.getNotification();
      
      // Mostrar la notificación del sistema
      notification.display();
      
      // Mostrar también un toast dentro de la app
      const title = notification.title || 'Nueva notificación';
      const body = notification.body || '';
      const data = notification.additionalData as any;
      
      Toast.show({
        type: 'success',
        text1: title,
        text2: body,
        visibilityTime: 4000,
        autoHide: true,
        onPress: () => {
          Toast.hide();
          if (data?.citaId) {
            const isDoneFromHistory = data.tipo === 'cita_pendiente';
            openAppointmentInformationModal(data.citaId, isDoneFromHistory);
          }
        },
      });
    },
    [],
  );

  const clickHandler = useCallback((event: NotificationClickEvent) => {
    console.log('OneSignal: notification clicked:', event);
    const data = event.notification.additionalData as any;
    
    // Si la notificación contiene un citaId, abrir el modal de la cita
    if (data?.citaId) {
      const isDoneFromHistory = data.tipo === 'cita_pendiente';
      setTimeout(() => {
        openAppointmentInformationModal(data.citaId, isDoneFromHistory);
      }, 500);
    }
  }, []);

  useEffect(() => {
    if (isEnabled && !isMounted) {
      console.log('Inicializando OneSignal...');
      OneSignal.initialize(ONESIGNAL_APP_ID);
      OneSignal.Debug.setLogLevel(LogLevel.Verbose);
      
      // Establecer el ID externo del usuario (username) si está disponible
      if (username) {
        OneSignal.login(username);
        console.log('OneSignal: Usuario autenticado con username:', username);
        
        // Establecer tags por defecto para notificaciones (habilitados)
        // Forzar el establecimiento de los tags para asegurar que todos los usuarios los tengan
        OneSignal.User.addTag('notif_30min_enabled', 'true');
        OneSignal.User.addTag('notif_cierre_cita_enabled', 'true');
        console.log('OneSignal: Tags de notificaciones establecidos (30min y cierre de cita)');
      }
      
      if (!OneSignal.Notifications.hasPermission()) {
        OneSignal.Notifications.canRequestPermission().then(() => {
          OneSignal.Notifications.requestPermission(true);
        });
      }
      setIsMounted(true);
      console.log('OneSignal inicializado correctamente');
    }

    OneSignal.Notifications.addEventListener('click', clickHandler);
    OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      showInForegroundHandler,
    );

    return () => {
      OneSignal.Notifications.removeEventListener('click', clickHandler);
      OneSignal.Notifications.removeEventListener(
        'foregroundWillDisplay',
        showInForegroundHandler,
      );
    };
  }, [clickHandler, isEnabled, isMounted, showInForegroundHandler, username]);

  return {};
};

export const logoutOnesignal = () => {
  OneSignal.logout();
  console.log('OneSignal: Usuario desautenticado');
};
