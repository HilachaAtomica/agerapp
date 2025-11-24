import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../../navigation/navigation.auth';
import {useColors} from '../../../hooks/hook.color';
import {AppTabParamList} from '../../../navigation/navigation.app';
import AppointmentItem from '../../../components/appointment-item';
import {useCallback} from 'react';
import AppointmentHistoryItem from '../../../components/appintment-history-item';
import Header from '../../../components/ui/header';
import {openAppointmentInformationModal} from '../../../utils/utils.global';
import {
  useGetUpcomingAppointmentsQuery,
  useGetPendingAppointmentsQuery,
} from '../../../redux/services/service.calendar';

type Props = NativeStackScreenProps<AppTabParamList, 'Home'>;

const Home = ({}: Props) => {
  const colors = useColors();

  // Obtener datos de las APIs
  const {
    data: upcomingAppointments = [],
    isLoading: loadingUpcoming,
    error: errorUpcoming,
  } = useGetUpcomingAppointmentsQuery();

  const {
    data: pendingAppointments = [],
    isLoading: loadingPending,
    error: errorPending,
  } = useGetPendingAppointmentsQuery();

  return (
    <SafeAreaView style={{flex: 1}} edges={['top']}>
      <Header title="Citas" />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.black}]}>
            Próximas citas
          </Text>
          {loadingUpcoming ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, {color: colors.grey}]}>
                Cargando citas...
              </Text>
            </View>
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments
              .slice(0, 3)
              .map((item, index) => (
                <AppointmentItem
                  key={index}
                  appointment={item}
                  isComming={true}
                  onPress={() => openAppointmentInformationModal(item.citaId)}
                />
              ))
          ) : (
            <Text style={[styles.emptyText, {color: colors.grey}]}>
              No hay próximas citas
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.black}]}>
            Pendientes de enviar
          </Text>
          {loadingPending ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, {color: colors.grey}]}>
                Cargando pendientes...
              </Text>
            </View>
          ) : pendingAppointments.length > 0 ? (
            pendingAppointments
              .slice(0, 3)
              .map((item, index) => (
                <AppointmentItem
                  key={index}
                  appointment={item}
                  iconColor={colors.orange}
                  icon="exclamation"
                  isPending
                  onPress={() => openAppointmentInformationModal(item.citaId)}
                />
              ))
          ) : (
            <Text style={[styles.emptyText, {color: colors.grey}]}>
              No hay citas pendientes
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
});

export default Home;
