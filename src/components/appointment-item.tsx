import {Pressable, StyleSheet, View} from 'react-native';
import {useColors} from '../hooks/hook.color';
import {Appointment} from '../models/calendar';
import Text from './ui/text';
import AppIcon, {IconNameProp} from './icons';
import moment from 'moment';

type Props = {
  appointment: Appointment;
  onPress?: () => void;
  icon?: IconNameProp;
  iconColor?: string;
  isPending?: boolean;
  isComming?: boolean; // Nueva prop para próximas citas
  isFromHistory?: boolean; // Nueva prop para citas del historial
};

const AppointmentItem = ({
  appointment,
  onPress,
  icon,
  iconColor,
  isPending,
  isComming,
  isFromHistory,
}: Props) => {
  const colors = useColors();

  // Calcular días restantes basado en fechaCita
  const getDaysRemaining = () => {
    if (!appointment.fechaCita) {
      // Si no hay fechaCita, usar fechaCitaFin
      const appointmentDate = moment(appointment.fechaCitaFin);
      const today = moment().startOf('day');
      const daysRemaining = appointmentDate.diff(today, 'days');
      return daysRemaining >= 0 ? daysRemaining : 0;
    }
    const appointmentDate = moment(appointment.fechaCita);
    const today = moment().startOf('day');
    const daysRemaining = appointmentDate.diff(today, 'days');
    return daysRemaining >= 0 ? daysRemaining : 0;
  };

  console.log('dias restantes:', getDaysRemaining());
  // Nueva función para obtener el estado de próximas citas
  const getCommingStatus = () => {
    if (!isComming && !isFromHistory) return null;

    const today = moment().startOf('day');
    const startDate = appointment.fechaCita
      ? moment(appointment.fechaCita).startOf('day')
      : null;
    const endDate = moment(appointment.fechaCitaFin).startOf('day');

    // Si viene del historial, siempre mostrar "Finalizada"
    if (isFromHistory) {
      return {
        text: 'Finalizada',
        color: colors.green,
      };
    }

    // Lógica para próximas citas (isComming = true)
    if (startDate) {
      // Si estamos entre fecha inicio y fecha fin = EN CURSO
      if (today.isSame(startDate)) {
        return {
          text: 'Hoy',
          color: colors.green,
        };
      }
      if (today.isBetween(startDate, endDate, 'day', '[]')) {
        return {
          text: 'En curso',
          color: colors.green,
        };
      }

      // Si aún no empieza (fecha inicio futura) = DÍAS RESTANTES
      if (today.isBefore(startDate)) {
        const daysRemaining = startDate.diff(today, 'days');
        if (daysRemaining === 1) return {text: 'Mañana', color: colors.yellow};
        return {
          text: `${daysRemaining} días`,
          color: colors.yellow,
        };
      }
    }

    // Si no hay fecha inicio, usar solo fecha fin
    if (!startDate) {
      // Si aún no llega la fecha fin = DÍAS RESTANTES
      if (today.isBefore(endDate) || today.isSame(endDate)) {
        const daysRemaining = endDate.diff(today, 'days');
        if (daysRemaining === 0) return {text: 'Hoy', color: colors.green};
        if (daysRemaining === 1) return {text: 'Mañana', color: colors.yellow};
        return {
          text: `${daysRemaining} días`,
          color: colors.yellow,
        };
      }
    }

    // Fallback - nunca debería llegar aquí
    return {text: 'Error', color: colors.primary};
  };

  const getDaysRemainingColor = () => {
    // Si es sección de próximas citas o historial, usar nueva lógica
    if (isComming || isFromHistory) {
      const status = getCommingStatus();
      return status?.color || colors.primary;
    }

    // Pendientes de cerrar en rojo
    if (isPending) return colors.red;

    return colors.green;
  };

  const getDaysRemainingText = () => {
    // Si es sección de próximas citas o historial, usar nueva lógica
    if (isComming || isFromHistory) {
      const status = getCommingStatus();
      return status?.text || '';
    }

    const daysRemaining = getDaysRemaining();
    // Si la cita está finalizada
    if (appointment.isDone) return 'Finalizada';

    // Si es pendiente, calcular días desde fechaCitaFin
    if (isPending) {
      const endDate = moment(appointment.fechaCitaFin);
      const today = moment().startOf('day');
      const daysSinceEnd = today.diff(endDate.startOf('day'), 'days');
      if (daysSinceEnd === 0) return 'Pendiente hoy';
      if (daysSinceEnd === 1) return 'Pendiente hace 1 día';
      return `Pendiente hace ${daysSinceEnd} días`;
    }

    if (daysRemaining === 0) return 'Hoy';
    if (daysRemaining === 1) return 'Mañana';
    return `${daysRemaining} días`;
  };

  // Formatear fechas según el tipo de cita
  const getDateTimeInfo = () => {
    if (isPending) {
      // Citas pendientes de cerrar: solo fecha fin
      const fechaFin = moment(appointment.fechaCitaFin).format('DD/MM/YYYY');
      return `Fecha fin: ${fechaFin}`;
    } else {
      // Próximas citas: fecha inicio y fin con horas
      if (!appointment.fechaCita) {
        // Si no hay fechaCita, mostrar solo fecha fin con hora
        const fechaFin = moment(appointment.fechaCitaFin).format(
          'DD/MM/YYYY HH:mm',
        );
        return `Fecha fin: ${fechaFin}`;
      }
      const fechaInicio = moment(appointment.fechaCita).format(
        'DD/MM/YYYY HH:mm',
      );
      const fechaFin = moment(appointment.fechaCitaFin).format(
        'DD/MM/YYYY HH:mm',
      );
      return `Fecha inicio: ${fechaInicio}\nFecha fin: ${fechaFin}`;
    }
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
              {backgroundColor: iconColor ?? getDaysRemainingColor()},
            ]}>
            <AppIcon size={16} name={icon ?? 'clock'} color={colors.white} />
          </View>
          <Text fw="bold" style={{fontSize: 18}}>
            {appointment.expedienteId}
          </Text>
        </View>

        {(isComming || isPending || isFromHistory) && (
          <Text fw="semibold" color={getDaysRemainingColor()}>
            {getDaysRemainingText()}
          </Text>
        )}
      </View>

      <View style={styles.detailsContainer}>
        <Text color={colors.grey} numberOfLines={2}>
          {appointment.domicilioCliente}
        </Text>

        <Text color={colors.grey} numberOfLines={1}>
          {appointment.localidadCliente}
        </Text>

        <Text color={colors.grey} numberOfLines={isPending ? 1 : 2}>
          {getDateTimeInfo()}
        </Text>
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
