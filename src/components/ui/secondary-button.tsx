import {ReactNode, useMemo} from 'react';
import {
  PressableProps,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
  View,
  Pressable,
} from 'react-native';
import {ColorType} from '../../theme/color';
import {useColors} from '../../hooks/hook.color';
import Text from './text';

export type ButtonSize = {
  sm: number;
  smMd: number;
  md: number;
  mdLg: number;
};

export const buttonSize: ButtonSize = {
  sm: 27,
  smMd: 42,
  md: 53,
  mdLg: 60,
};

export type SizeProp = keyof ButtonSize;

export type ButtonProps = PressableProps & {
  size?: SizeProp;
  style?: StyleProp<ViewStyle>;
  textStyles?: StyleProp<TextStyle>;
  color?: ColorType | string;
  colorText?: string;
  disabled?: boolean;
  children: ReactNode;
};

const UiSecondaryButton = ({
  size = 'sm',
  style,
  textStyles,
  color,
  colorText,
  onPress,
  disabled,
  children,
}: ButtonProps) => {
  const colors = useColors();

  const bgColor = useMemo(
    () => color ?? colors.primary,
    [disabled, color, colors],
  );

  const textColor = useMemo(
    () => colorText ?? colors.primary,
    [colorText, colors],
  );

  const sizeButton = buttonSize[size] || buttonSize.sm;

  return (
    <Pressable
      accessibilityRole="button"
      style={[
        styles.button,
        {
          borderColor: bgColor,
          height: sizeButton,
          opacity: disabled ? 0.4 : 1,
          backgroundColor: colors.white,
        },
        style,
      ]}
      onPress={!disabled ? onPress : undefined}>
      <View style={styles.content}>
        {typeof children === 'string' ? (
          <Text
            color={textColor}
            style={[{fontSize: 18}, textStyles]}
            fw="medium">
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
});

export default UiSecondaryButton;
