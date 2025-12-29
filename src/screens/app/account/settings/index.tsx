import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useColors} from '../../../../hooks/hook.color';

import Header from '../../../../components/ui/header';
import {useCallback} from 'react';

import SettingsItem from '../../../../components/settings-item';
import {AccountParamList} from '..';
import {useLogout} from '../../../../hooks/useLogout';

type Props = NativeStackScreenProps<AccountParamList, 'Settings'>;

const Settings = ({navigation}: Props) => {
  const colors = useColors();
  const {logout} = useLogout();

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
});

export default Settings;
