import {useCallback, useMemo, useState} from 'react';
import {
  ColorValue,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useColors} from '../../hooks/hook.color';
import AppIcon, {IconNameProp} from '../icons';

export type UITextInputType =
  | 'email'
  | 'password'
  | 'user'
  | 'default'
  | 'numeric';

export type UITextInputProps = {
  label?: string;
  textColor?: ColorValue;
  wrapperStyle?: StyleProp<ViewStyle>;
  textInputStyle?: StyleProp<TextStyle>;
  backgroundColor?: ColorValue;
  type?: UITextInputType;
  leftIcon?: IconNameProp;
  rightIcon?: IconNameProp;
  onChange?: (next: any) => void;
} & Omit<TextInputProps, 'style'>;

const UITextInput = ({
  label,
  textColor,
  backgroundColor,
  placeholderTextColor,
  wrapperStyle,
  textInputStyle,
  secureTextEntry,
  leftIcon,
  rightIcon,
  type = 'default',
  onChange,
  ...props
}: UITextInputProps) => {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState<boolean>(
    type === 'password',
  );

  const renderRightIcon = useMemo(() => {
    if (type === 'password') {
      return (
        <Pressable onPress={() => setIsPasswordSecure(!isPasswordSecure)}>
          <AppIcon
            color={colors.grey}
            name={isPasswordSecure ? 'eyeOpen' : 'eyeClose'}
            size={24}
          />
        </Pressable>
      );
    }
    return (
      rightIcon && <AppIcon color={colors.grey} name={rightIcon} size={24} />
    );
  }, [rightIcon, type, isPasswordSecure, colors]);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor ?? colors.white,
          borderColor: isFocused ? colors.primary : colors.grey,
        },
        wrapperStyle,
      ]}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}>
        {leftIcon && <AppIcon color={colors.grey} name={leftIcon} size={24} />}
        <View style={[styles.textInputContainer]}>
          {!!props.value && label && (
            <Text style={[styles.label, {color: textColor ?? colors.grey}]}>
              {label}
            </Text>
          )}

          <TextInput
            {...props}
            placeholderTextColor={placeholderTextColor ?? colors.grey}
            secureTextEntry={secureTextEntry ?? isPasswordSecure}
            cursorColor={colors.primary}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={onChange}
            keyboardType={
              type === 'email'
                ? 'email-address'
                : type === 'numeric'
                ? 'numeric'
                : 'default'
            }
            autoCapitalize={type === 'email' ? 'none' : 'sentences'}
            style={[
              styles.textInput,
              {color: colors.black, backgroundColor: backgroundColor},
              textInputStyle,
            ]}
          />
        </View>
        {renderRightIcon}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4, //ESTE PADDING TAMBIEN ACTUA COMO GAP ENTRE LOS TEXTOS
    borderWidth: 1,
    width: '100%',
    height: 54,
    gap: 16,
  },
  label: {
    fontSize: 14,
  },
  textInputContainer: {
    flex: 1,
  },
  textInput: {
    fontSize: 16,
    padding: 0,
    margin: 0,
    flex: 1,
  },
});

export default UITextInput;
