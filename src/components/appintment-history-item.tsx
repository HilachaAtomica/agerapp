import {Pressable, StyleSheet, View} from 'react-native';
import {useColors} from '../hooks/hook.color';
import moment from 'moment';
import 'moment/locale/es';
import Text from './ui/text';
import AppIcon from './icons';
import {Appointment} from '../models/calendar';

type Props = {
  appointment: Appointment;
  onPress?: () => void;
};

const AppointmentHistoryItem = ({appointment, onPress}: Props) => {
  const colors = useColors();

  moment.locale('es');

  // Formatear la fecha correctamente
  const formattedDate = appointment.fechaCitaFin
    ? (() => {
        const fechaFinMoment = moment(appointment.fechaCitaFin);
        // Detectar si es "sin hora" (00:00 o 01:00)
        if ((fechaFinMoment.hour() === 0 || fechaFinMoment.hour() === 1) && fechaFinMoment.minute() === 0) {
          return `${fechaFinMoment.format('DD/MM/YYYY')} - Sin hora`;
        }
        return fechaFinMoment.format('DD/MM/YYYY HH:mm');
      })()
    : 'Sin fecha';

  return (
    <Pressable
      style={[styles.container, {backgroundColor: colors.white}]}
      onPress={onPress}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, {backgroundColor: colors.green}]}>
          <AppIcon size={16} name="check" color={colors.white} />
        </View>
        <Text fw="bold" style={{fontSize: 16}}>
          {appointment.expedienteId}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text color={colors.grey} numberOfLines={2}>
          {appointment.domicilioCliente}
        </Text>
        <Text color={colors.grey}>{formattedDate}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailsContainer: {
    marginTop: 8,
    gap: 3,
  },
  iconContainer: {
    padding: 3,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default AppointmentHistoryItem;
