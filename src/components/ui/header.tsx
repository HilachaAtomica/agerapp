import {ReactNode, useMemo} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useColors} from '../../hooks/hook.color';

import Text from './text';
import AppIcon from '../icons';

type Props = {
  style?: StyleProp<ViewStyle>;
  title?: string;
  renderLeft?: ReactNode;
  renderRight?: ReactNode;
  backgroundColor?: string;
  useInsets?: boolean;
  goBack?: () => void;
  colorText?: string;
  titleStyle?: StyleProp<TextStyle>;
};

const UIHeader = ({
  style,
  title,
  renderLeft,
  renderRight,
  useInsets = true,
  goBack,
  backgroundColor,
  titleStyle,
}: Props) => {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const paddingTop = useMemo(
    () => (useInsets ? insets.top || 0 : 0),
    [useInsets, insets],
  );

  return (
    <View style={[styles.container, style]}>
      {goBack || renderLeft ? (
        <Pressable onPress={goBack} style={styles.leftContainer}>
          {renderLeft ? (
            renderLeft
          ) : (
            <AppIcon name="arrowLeft" color={colors.black} size={32} />
          )}
        </Pressable>
      ) : (
        <View style={{width: 32}} />
      )}
      {title && (
        <Text
          style={[styles.title, titleStyle]}
          fw="medium"
          color={colors.black}>
          {title}
        </Text>
      )}

      {!!renderRight ? (
        <View style={styles.rightContainer}>{renderRight}</View>
      ) : (
        <View style={{width: 32}} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },

  leftContainer: {
    height: 32,
    aspectRatio: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
  },
});

export default UIHeader;
