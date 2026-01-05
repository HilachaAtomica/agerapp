import {StyleSheet, View, Switch} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useColors} from '../../../../hooks/hook.color';

import Header from '../../../../components/ui/header';
import {useCallback, useEffect, useState} from 'react';

import SettingsItem from '../../../../components/settings-item';
import {AccountParamList} from '..';
import {useLogout} from '../../../../hooks/useLogout';
import {OneSignal} from 'react-native-onesignal';
import Text from '../../../../components/ui/text';

type Props = NativeStackScreenProps<AccountParamList, 'Settings'>;

const Settings = ({navigation}: Props) => {
  const colors = useColors();
  const {logout} = useLogout();
  const [notif30MinEnabled, setNotif30MinEnabled] = useState(true);

  // Cargar preferencia al montar el componente
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const tags = await OneSignal.User.getTags();
        // Si el tag existe y es 'false', está desactivado
        const isEnabled = tags.notif_30min_enabled !== 'false';
        setNotif30MinEnabled(isEnabled);
      } catch (error) {
        console.log('Error al cargar preferencia de notificaciones:', error);
      }
    };
    loadPreference();
  }, []);

  const handleToggleNotif30Min = useCallback(async (value: boolean) => {
    setNotif30MinEnabled(value);
    try {
      // Guardar en OneSignal como tag
      await OneSignal.User.addTag('notif_30min_enabled', value ? 'true' : 'false');
      console.log('Preferencia de notificaciones guardada:', value);
    } catch (error) {
      console.error('Error al guardar preferencia:', error);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    logout();
  }, [logout]);

  return (
    <SafeAreaView style={{flex: 1}} edges={['top', 'bottom']}>
      <Header title="Cuenta" />
      <View style={styles.contentContainer}>
        <View style={[styles.section, {backgroundColor: colors.white}]}>
          <SettingsItem
            icon="history"
            title="Historial de citas"
            onPress={() => navigation.navigate('AppointmentHistory')}
          />
        </View>
        
        {/* Sección de Notificaciones */}
        <View style={[styles.section, {backgroundColor: colors.white}]}>
          <View style={styles.notificationItem}>
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationTitle} weight="semibold">
                Notificaciones de 30 minutos
              </Text>
              <Text style={[styles.notificationSubtitle, {color: colors.gray}]}>
                Recibe un aviso 30 minutos antes de tus citas
              </Text>
            </View>
            <Switch
              value={notif30MinEnabled}
              onValueChange={handleToggleNotif30Min}
              trackColor={{false: colors.lightGray, true: colors.primary}}
              thumbColor={colors.white}
            />
          </View>
        </View>
        
        <View style={[styles.section, {backgroundColor: colors.white}]}>
          <SettingsItem
            icon="logout"
            title="Cerrar sesión"
            onPress={handleLogout}
            color={colors.red}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 24,
  },
  section: {
    padding: 24,
    gap: 24,
    borderRadius: 12,
  },
  image: {
    height: 32,
    aspectRatio: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 13,
  },
});

export default Settings;
