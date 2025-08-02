import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useColors} from '../../../../hooks/hook.color';
import Header from '../../../../components/ui/header';
import {useCallback, useState} from 'react';
import {AccountParamList} from '..';
import AppointmentHistoryItem from '../../../../components/appintment-history-item';
import {Appointment} from '../../../../models/calendar';
import {useGetAppointmentsHistoryQuery} from '../../../../redux/services/service.calendar';
import Text from '../../../../components/ui/text';

type Props = NativeStackScreenProps<AccountParamList, 'AppointmentHistory'>;

const AppointmentHistory = ({navigation}: Props) => {
  const colors = useColors();
  const [offset, setOffset] = useState(0);
  const limit = 10; // Número de elementos por página

  // Obtener historial de citas usando la API
  const {
    data: appointmentsHistory = [],
    isLoading,
    error,
    refetch,
  } = useGetAppointmentsHistoryQuery({
    offset,
    limit,
  });

  const renderItem = useCallback(
    ({item}: {item: Appointment}) => (
      <AppointmentHistoryItem
        appointment={item}
        onPress={() => console.log('Cita del historial seleccionada:', item)}
      />
    ),
    [],
  );

  const handleLoadMore = useCallback(() => {
    if (!isLoading && appointmentsHistory.length >= limit) {
      setOffset(prevOffset => prevOffset + limit);
    }
  }, [isLoading, appointmentsHistory.length, limit]);

  const renderFooter = useCallback(() => {
    if (isLoading && offset > 0) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      );
    }
    return null;
  }, [isLoading, offset, colors.primary]);

  const renderEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, {color: colors.grey}]}>
            Cargando historial...
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, {color: colors.grey}]}>
          No hay historial de citas disponible
        </Text>
      </View>
    );
  }, [isLoading, colors]);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Header title="Historial de citas" goBack={navigation.goBack} />
      <FlatList
        data={appointmentsHistory}
        renderItem={renderItem}
        keyExtractor={item => item.expedienteId.toString()}
        contentContainerStyle={[
          styles.listContent,
          appointmentsHistory.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading && offset === 0}
        onRefresh={() => {
          setOffset(0);
          refetch();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    gap: 12,
  },
  loadingFooter: {
    padding: 16,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AppointmentHistory;
