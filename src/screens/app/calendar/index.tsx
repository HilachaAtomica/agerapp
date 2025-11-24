import {ScrollView, StyleSheet, View, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppTabParamList} from '../../../navigation/navigation.app';
import {Calendar} from 'react-native-calendars';
import {useColors} from '../../../hooks/hook.color';
import {useState, useEffect, useCallback} from 'react';
import moment from 'moment';
import 'moment/locale/es';
import AppIcon from '../../../components/icons';
import Text from '../../../components/ui/text';
import AppointmentItem from '../../../components/appointment-item';
import Header from '../../../components/ui/header';
import {openAppointmentInformationModal} from '../../../utils/utils.global';
import {Appointment} from '../../../models/calendar';
import {
  useGetDaysWithAppointmentsQuery,
  useGetAppointmentsByDayQuery,
} from '../../../redux/services/service.calendar';

type Props = NativeStackScreenProps<AppTabParamList, 'Calendar'>;

const CalendarScreen = ({}: Props) => {
  const colors = useColors();
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [currentMonth, setCurrentMonth] = useState(moment().format('YYYY-MM'));
  const [markedDates, setMarkedDates] = useState({});
  const [filteredAppointments, setFilteredAppointments] = useState<
    Appointment[]
  >([]);

  moment.locale('es');

  // Calcular fechas del mes actual
  const startOfMonth = moment(currentMonth)
    .startOf('month')
    .format('YYYY-MM-DD');
  const endOfMonth = moment(currentMonth).endOf('month').format('YYYY-MM-DD');

  // Queries para obtener datos de las APIs
  const {data: daysWithAppointments = [], isLoading: loadingDays} =
    useGetDaysWithAppointmentsQuery({
      desde: startOfMonth,
      hasta: endOfMonth,
    });

  const {data: appointmentsForDay = [], isLoading: loadingAppointments} =
    useGetAppointmentsByDayQuery(selectedDate);

  useEffect(() => {
    const marked: any = {};

    // Marcar todas las fechas con citas usando la API
    daysWithAppointments.forEach(date => {
      marked[date] = {
        dots: [{color: colors.primary, size: 10}],
      };
    });

    // Marcar la fecha seleccionada
    marked[selectedDate] = {
      ...(marked[selectedDate] || {}),
      selected: true,
      selectedColor: colors.primary,
    };

    setMarkedDates(marked);

    // Usar directamente los datos de la API sin conversión
    setFilteredAppointments(appointmentsForDay);
  }, [selectedDate, colors.primary, daysWithAppointments, appointmentsForDay]);
  const handleSelectDay = useCallback((day: any) => {
    setSelectedDate(day.dateString);
  }, []);

  // Función para manejar el cambio de mes
  const handleMonthChange = useCallback((month: any) => {
    setCurrentMonth(month.dateString.substring(0, 7)); // Formato YYYY-MM
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Calendario" />

      <View style={{padding: 16}}>
        <Calendar
          style={{borderRadius: 8}}
          markingType="multi-dot"
          markedDates={markedDates}
          onDayPress={handleSelectDay}
          onMonthChange={handleMonthChange}
          hideExtraDays={true}
          firstDay={1}
          renderArrow={direction =>
            direction === 'left' ? (
              <AppIcon name="arrowLeft" size={20} color={colors.primary} />
            ) : (
              <AppIcon name="arrowRight" size={20} color={colors.primary} />
            )
          }
          disableAllTouchEventsForDisabledDays={true}
          enableSwipeMonths={true}
          theme={{
            todayTextColor: colors.primary,
            textSectionTitleColor: colors.primary,
            selectedDayBackgroundColor: colors.primary,
            dayTextColor: colors.black,
            textDisabledColor: colors.grey,
            monthTextColor: colors.primary,
            'stylesheet.dot': {
              dot: {
                width: 12,
                height: 12,
                marginTop: 1,
                marginLeft: 1,
                marginRight: 1,
                borderRadius: 6,
              },
            },
          }}
          renderHeader={() => (
            <Text
              style={{
                textTransform: 'capitalize',
                fontSize: 20,
                fontWeight: 'bold',
                color: colors.primary,
              }}>
              {moment(currentMonth).format('MMMM YYYY')}
            </Text>
          )}
        />

        {loadingDays && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingText, {color: colors.grey}]}>
              Cargando calendario...
            </Text>
          </View>
        )}
      </View>

      <View style={styles.appointmentsSection}>
        <Text style={styles.dateTitle}>
          {moment(selectedDate).format('dddd, D [de] MMMM')}
        </Text>

        <ScrollView
          style={styles.appointmentsList}
          contentContainerStyle={{gap: 12}}>
          {loadingAppointments ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, {color: colors.grey}]}>
                Cargando citas...
              </Text>
            </View>
          ) : filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment, index) => (
              <AppointmentItem
                key={index}
                appointment={appointment}
                onPress={() =>
                  openAppointmentInformationModal(appointment.citaId)
                }
              />
            ))
          ) : (
            <View style={styles.noAppointmentsContainer}>
              <AppIcon name="calendar" size={48} color={colors.grey} />
              <Text style={styles.noAppointments}>
                No hay citas programadas para esta fecha
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appointmentsSection: {
    flex: 1,
    padding: 16,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  appointmentsList: {
    flex: 1,
  },
  noAppointmentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  noAppointments: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 12,
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
});

export default CalendarScreen;
