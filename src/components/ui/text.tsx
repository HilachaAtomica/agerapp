import {useMemo} from 'react';
import {StyleSheet, Text, TextProps, TextStyle} from 'react-native';
import {useColors} from '../../hooks/hook.color';
import {ColorType} from '../../theme/color';

// Hooks

export type UITextProps = TextProps & {
  color?: ColorType | string;
  fw?: 'bold' | 'semibold' | 'medium' | 'regular' | 'thin';
};

// Render
const UIText = (props: UITextProps) => {
  const colors = useColors();

  const textColor = useMemo(() => {
    if (props?.color && colors[props?.color as ColorType]) {
      return colors[props?.color as ColorType];
    }

    return props?.color || colors.black;
  }, [colors, props?.color]);

  const fontWeight: TextStyle['fontWeight'] = useMemo(() => {
    switch (props?.fw) {
      case 'bold':
        return '700';
      case 'semibold':
        return '600';
      case 'medium':
        return '500';
      case 'regular':
        return '400';
      case 'thin':
        return '300';
      default:
        return '400';
    }
  }, [props?.fw]);

  const textProps = useMemo(
    () => ({
      ...props,
      style: [styles.text, {color: textColor, fontWeight}, props?.style],
    }),
    [props, textColor, fontWeight],
  );

  return <Text {...textProps}>{props?.children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
  },
});

export default UIText;
