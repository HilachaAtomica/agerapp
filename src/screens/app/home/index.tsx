import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../../navigation/navigation.auth';
import {useColors} from '../../../hooks/hook.color';
import {AppTabParamList} from '../../../navigation/navigation.app';
import AppointmentItem from '../../../components/appointment-item';
import {useCallback, useState} from 'react';
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
  const [refreshing, setRefreshing] = useState(false);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllPending, setShowAllPending] = useState(false);

  // Obtener datos de las APIs
  const {
    data: upcomingAppointments = [],
    isLoading: loadingUpcoming,
    error: errorUpcoming,
    refetch: refetchUpcoming,
  } = useGetUpcomingAppointmentsQuery();

  const {
    data: pendingAppointments = [],
    isLoading: loadingPending,
    error: errorPending,
    refetch: refetchPending,
  } = useGetPendingAppointmentsQuery();

  // Función para hacer refetch de todas las APIs
  const refetchAllApis = useCallback(async () => {
    try {
      await Promise.all([refetchUpcoming(), refetchPending()]);
    } catch (error) {
      console.error('Error al actualizar las APIs:', error);
    }
  }, [refetchUpcoming, refetchPending]);

  // Función para manejar el pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchAllApis();
    } finally {
      setRefreshing(false);
    }
  }, [refetchAllApis]);

  return (
    <SafeAreaView style={{flex: 1}} edges={['top']}>
      <Header title="Citas" />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, {color: colors.black}]}>
              Próximas citas
            </Text>
            {upcomingAppointments.length > 3 && (
              <Pressable onPress={() => setShowAllUpcoming(!showAllUpcoming)}>
                <Text style={[styles.seeMoreText, {color: colors.primary}]}>
                  {showAllUpcoming ? 'Ver menos' : 'Ver más'}
                </Text>
              </Pressable>
            )}
          </View>
          {loadingUpcoming ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, {color: colors.grey}]}>
                Cargando citas...
              </Text>
            </View>
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments
              .slice(0, showAllUpcoming ? upcomingAppointments.length : 3)
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
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, {color: colors.black}]}>
              Pendientes de parte
            </Text>
            {pendingAppointments.length > 3 && (
              <Pressable onPress={() => setShowAllPending(!showAllPending)}>
                <Text style={[styles.seeMoreText, {color: colors.primary}]}>
                  {showAllPending ? 'Ver menos' : 'Ver más'}
                </Text>
              </Pressable>
            )}
          </View>
          {loadingPending ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, {color: colors.grey}]}>
                Cargando pendientes...
              </Text>
            </View>
          ) : pendingAppointments.length > 0 ? (
            pendingAppointments
              .slice(0, showAllPending ? pendingAppointments.length : 3)
              .map((item, index) => (
                <AppointmentItem
                  key={index}
                  appointment={item}
                  iconColor={colors.red}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeMoreText: {
    fontSize: 14,
    fontWeight: '600',
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
