import {Pressable, StyleSheet, View} from 'react-native';

import {useMemo} from 'react';
import AppIcon, {IconNameProp} from './icons';
import {useColors} from '../hooks/hook.color';
import Text from './ui/text';

type Props = {
  icon: IconNameProp;
  title: string;
  onPress: () => void;
  color?: string;
};

const SettingsItem = ({icon, title, onPress, color}: Props) => {
  const colors = useColors();
  const settingsColor = useMemo(() => {
    return color ?? colors.grey;
  }, [color]);
  return (
    <Pressable onPress={onPress} style={styles.main}>
      <View style={styles.left}>
        <AppIcon name={icon} color={settingsColor} />
        <Text fw="semibold" color={settingsColor}>
          {title}
        </Text>
      </View>

      <AppIcon name="arrowRight" color={settingsColor} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
  },
  left: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
});

export default SettingsItem;
