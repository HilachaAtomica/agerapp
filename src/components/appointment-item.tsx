import {Pressable, StyleSheet, View} from 'react-native';
import {useColors} from '../hooks/hook.color';
import {Appointment} from '../models/calendar';
import Text from './ui/text';
import AppIcon from './icons';
import moment from 'moment';

type Props = {
  appointment: Appointment;
  onPress?: () => void;
};

const AppointmentItem = ({appointment, onPress}: Props) => {
  const colors = useColors();

  // Calcular días restantes basado en fechaCita
  const getDaysRemaining = () => {
    const appointmentDate = moment(appointment.fechaCita);
    const today = moment().startOf('day');
    const daysRemaining = appointmentDate.diff(today, 'days');
    return daysRemaining >= 0 ? daysRemaining : 0;
  };

  const getDaysRemainingColor = () => {
    const daysRemaining = getDaysRemaining();
    if (daysRemaining <= 3) return colors.red;
    if (daysRemaining <= 7) return colors.yellow;
    return colors.green;
  };

  const getDaysRemainingText = () => {
    const daysRemaining = getDaysRemaining();
    if (daysRemaining === 0) return 'Hoy';
    if (daysRemaining === 1) return 'Mañana';
    return `${daysRemaining} días`;
  };

  // Formatear hora
  const getTimeRange = () => {
    const start = moment(appointment.fechaCita).format('HH:mm');
    const end = moment(appointment.fechaCitaFin).format('HH:mm');
    return `${start} - ${end}`;
  };

  return (
    <Pressable
      style={[styles.container, {backgroundColor: colors.white}]}
      onPress={onPress}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
          <View
            style={[
              styles.iconContainer,
              {backgroundColor: getDaysRemainingColor()},
            ]}>
            <AppIcon size={16} name="clock" color={colors.white} />
          </View>
          <Text fw="bold" style={{fontSize: 16}}>
            Expediente #{appointment.expedienteId}
          </Text>
        </View>

        <Text fw="semibold" color={getDaysRemainingColor()}>
          {getDaysRemainingText()}
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text color={colors.grey} numberOfLines={2}>
          {appointment.domicilioCliente}
        </Text>

        <Text color={colors.grey} numberOfLines={1}>
          {appointment.localidadCliente}
        </Text>

        <Text color={colors.grey}>{getTimeRange()}</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
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

export default AppointmentItem;
