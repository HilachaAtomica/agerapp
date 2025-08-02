import {useCallback, useMemo} from 'react';
import {Pressable, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {useColors} from '../../hooks/hook.color';
import AppIcon from '../icons';

type Props = {
  checked?: boolean;
  style?: StyleProp<ViewStyle>;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
};

const Checkbox = ({checked, style, onChange, disabled}: Props) => {
  const colors = useColors();

  const handleChange = useCallback(() => {
    if (!!disabled) return;

    !!onChange && onChange(!checked);
  }, [checked, onChange, disabled]);

  const backgroundColor = useMemo(() => {
    if (!!disabled) {
      return colors.lightGrey;
    }

    return colors.white;
  }, [checked, colors, disabled]);

  return (
    <Pressable
      style={[
        styles.main,
        {
          backgroundColor: backgroundColor,
          borderColor: colors.primary,
          borderWidth: checked ? 2 : 0,
        },
        style,
      ]}
      onPress={handleChange}>
      <>
        {(!!checked || !!disabled) && (
          <AppIcon
            name="check"
            size={16}
            color={disabled ? colors.grey : colors.black}
          />
        )}
      </>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  main: {
    height: 24,
    aspectRatio: 1,
    borderRadius: 4,

    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Checkbox;
