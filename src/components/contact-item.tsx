import {Linking, Pressable, StyleSheet, View} from 'react-native';
import {useColors} from '../hooks/hook.color';
import {Appointment, Contact} from '../models/appointments';
import Text from './ui/text';
import AppIcon from './icons';

type Props = {
  contact: Contact;
  onPress?: () => void;
};

const ContactItem = ({contact, onPress}: Props) => {
  const colors = useColors();

  const onPressWhatsapp = () => {
    // Eliminar caracteres no numéricos del número de teléfono
    const phoneNumber = contact.phone.replace(/[^\d]/g, '');
    // Abrir WhatsApp con el número de teléfono
    Linking.openURL(`whatsapp://send?phone=+${phoneNumber}`).catch(err => {
      console.error('Error al abrir WhatsApp:', err);
      // Fallback para web en caso de que la app de WhatsApp no esté instalada
      Linking.openURL(`https://wa.me/${phoneNumber}`);
    });
  };

  const onPressCall = () => {
    // Eliminar caracteres no numéricos del número de teléfono
    const phoneNumber = contact.phone.replace(/[^\d]/g, '');
    // Realizar llamada telefónica
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <Pressable
      style={[styles.container, {backgroundColor: colors.white}]}
      onPress={onPress}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View
            style={[styles.iconContainer, {backgroundColor: colors.primary}]}>
            <AppIcon size={24} name="user" color={colors.white} />
          </View>
          <Text fw="bold" style={styles.nameText}>
            {contact.name} - {contact.role}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text color={colors.grey} numberOfLines={2} style={styles.detailText}>
            {contact.address}
          </Text>
          <Text color={colors.grey} numberOfLines={2} style={styles.detailText}>
            {contact.additionalInfo}
          </Text>
        </View>
        <View style={styles.iconsContainer}>
          <Pressable style={styles.iconButton} onPress={onPressWhatsapp}>
            <AppIcon size={24} name="whatsapp" color={colors.green} />
          </Pressable>

          <Pressable style={styles.iconButton} onPress={onPressCall}>
            <AppIcon size={24} name="phone" color={colors.green} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nameText: {
    fontSize: 14,
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  detailsContainer: {
    marginTop: 3,
    gap: 6,
  },
  detailText: {
    flexShrink: 1,
  },
  contentContainer: {
    gap: 6,
    width: '100%',
  },
  iconsContainer: {
    gap: 6,
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'flex-start',
  },
  iconButton: {
    padding: 5,
  },
});

export default ContactItem;
