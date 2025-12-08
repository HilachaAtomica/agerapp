import {
  FlatList,
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useColors} from '../../../../hooks/hook.color';
import Header from '../../../../components/ui/header';
import {useCallback, useState} from 'react';
import {AccountParamList} from '..';
import AppointmentHistoryItem from '../../../../components/appintment-history-item';
import {Appointment} from '../../../../models/calendar';
import {
  useGetAppointmentsHistoryQuery,
  useSearchCitasQuery,
} from '../../../../redux/services/service.calendar';
import {openAppointmentInformationModal} from '../../../../utils/utils.global';
import Text from '../../../../components/ui/text';
import Input from '../../../../components/ui/input';

type Props = NativeStackScreenProps<AccountParamList, 'AppointmentHistory'>;

const AppointmentHistory = ({navigation}: Props) => {
  const colors = useColors();
  const [page, setPage] = useState(0);
  const size = 10; // Número de elementos por página
  const [searchText, setSearchText] = useState('');
  const [searchPage, setSearchPage] = useState(0);
  const searchSize = 10;

  // Determinar si hay búsqueda activa (al menos 3 caracteres)
  const isSearching = searchText.trim().length >= 3;

  // Obtener historial de citas usando la API
  const {
    data: historyData,
    isLoading: isLoadingHistory,
    error: errorHistory,
    refetch: refetchHistory,
  } = useGetAppointmentsHistoryQuery(
    {
      page,
      size,
    },
    {skip: isSearching},
  );

  const appointmentsHistory = historyData?.content || [];
  const totalPages = historyData?.totalPages || 0;
  const currentPage = historyData?.number || 0;

  // Query de búsqueda
  const {
    data: searchData,
    isLoading: isLoadingSearch,
    error: errorSearch,
    refetch: refetchSearch,
  } = useSearchCitasQuery(
    {
      filtro: searchText.trim(),
      page: searchPage,
      size: searchSize,
    },
    {skip: !isSearching},
  );

  const searchResults = searchData?.content || [];
  const searchTotalPages = searchData?.totalPages || 0;
  const searchCurrentPage = searchData?.number || 0;

  // Determinar qué datos mostrar
  const displayData = isSearching ? searchResults : appointmentsHistory;
  const isLoading = isSearching ? isLoadingSearch : isLoadingHistory;
  const error = isSearching ? errorSearch : errorHistory;
  const activeTotalPages = isSearching ? searchTotalPages : totalPages;
  const activeCurrentPage = isSearching ? searchCurrentPage : currentPage;

  const renderItem = useCallback(
    ({item}: {item: Appointment}) => (
      <AppointmentHistoryItem
        appointment={{...item, isDone: true}}
        onPress={() => openAppointmentInformationModal(item.citaId, true)}
      />
    ),
    [],
  );

  // Funciones de paginación
  const handlePreviousPage = useCallback(() => {
    if (isSearching) {
      if (searchPage > 0) setSearchPage(searchPage - 1);
    } else {
      if (page > 0) setPage(page - 1);
    }
  }, [isSearching, searchPage, page]);

  const handleNextPage = useCallback(() => {
    if (isSearching) {
      setSearchPage(searchPage + 1);
    } else {
      if (page < totalPages - 1) setPage(page + 1);
    }
  }, [isSearching, searchPage, page, totalPages]);

  const renderFooter = useCallback(() => {
    if (displayData.length === 0) return null;

    return (
      <View style={styles.paginationContainer}>
        <Pressable
          style={[
            styles.paginationButton,
            {backgroundColor: colors.primary},
            activeCurrentPage === 0 && styles.paginationButtonDisabled,
          ]}
          onPress={handlePreviousPage}
          disabled={activeCurrentPage === 0}>
          <Text style={[styles.paginationButtonText, {color: colors.white}]}>
            Anterior
          </Text>
        </Pressable>

        <Text style={[styles.paginationText, {color: colors.grey}]}>
          Página {activeCurrentPage + 1}
          {activeTotalPages > 0 ? ` de ${activeTotalPages}` : ''}
        </Text>

        <Pressable
          style={[
            styles.paginationButton,
            {backgroundColor: colors.primary},
            activeTotalPages > 0 &&
              activeCurrentPage >= activeTotalPages - 1 &&
              styles.paginationButtonDisabled,
          ]}
          onPress={handleNextPage}
          disabled={
            activeTotalPages > 0 && activeCurrentPage >= activeTotalPages - 1
          }>
          <Text style={[styles.paginationButtonText, {color: colors.white}]}>
            Siguiente
          </Text>
        </Pressable>
      </View>
    );
  }, [
    displayData.length,
    activeCurrentPage,
    activeTotalPages,
    colors,
    handlePreviousPage,
    handleNextPage,
  ]);

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
      <View style={styles.searchContainer}>
        <Input
          placeholder="Buscar por expediente, calle o servicio..."
          value={searchText}
          onChange={text => {
            setSearchText(text);
            setSearchPage(0); // Reset page when search changes
          }}
        />
      </View>
      <FlatList
        data={displayData}
        renderItem={renderItem}
        keyExtractor={item => item.citaId.toString()}
        contentContainerStyle={[
          styles.listContent,
          displayData.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading && (isSearching ? searchPage === 0 : page === 0)}
        onRefresh={() => {
          if (isSearching) {
            setSearchPage(0);
            refetchSearch();
          } else {
            setPage(0);
            refetchHistory();
          }
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 12,
  },
  paginationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  paginationText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
});

export default AppointmentHistory;
