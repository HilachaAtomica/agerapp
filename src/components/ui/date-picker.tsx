import {useCallback, useMemo} from 'react';
import {Pressable, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {useColors} from '../../hooks/hook.color';

import Text from './text';
import AppIcon from '../icons';

type Props = {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  date?: string;
};

const UIDatePicker = ({style, onPress, date}: Props) => {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.main, {borderColor: colors.lightGrey}]}>
      <View style={styles.textContainer}>
        {date ? (
          <>
            <Text style={[{color: colors.grey}]}>{'Selecciona la fecha'}</Text>
            <Text style={[{color: colors.black}]}>{date}</Text>
          </>
        ) : (
          <Text style={[{color: colors.grey}]}>{'Selecciona la fecha'}</Text>
        )}
      </View>

      <View style={[styles.iconContainer, {backgroundColor: colors.primary}]}>
        <AppIcon name={'calendar'} color={colors.white} size={18} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    borderWidth: 1,
    borderRadius: 8,
    height: 54,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    padding: 6,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
});

export default UIDatePicker;
