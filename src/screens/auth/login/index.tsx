import {StyleSheet, View, Alert} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../../navigation/navigation.auth';
import {useColors} from '../../../hooks/hook.color';
import Text from '../../../components/ui/text';
import FastImage from 'react-native-fast-image';
import Input from '../../../components/ui/input';
import {useMemo, useState, useCallback} from 'react';
import {useForm} from 'react-hook-form';
import Button from '../../../components/ui/button';
import * as NavigationUtil from '../../../utils/utils.navigation';
import {useLoginMutation} from '../../../redux/services/service.auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ACCESS_TOKEN_KEY} from '../../../constants/constants.api';

export type LoginPayload = {
  username: string;
  password: string;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const Login = ({}: Props) => {
  const colors = useColors();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [loginUser] = useLoginMutation();

  const methods = useForm<LoginPayload>();

  const {control, handleSubmit, watch, setValue, reset} = methods;

  const [username, password] = watch(['username', 'password']);

  const isDisabled = useMemo(() => {
    return !username || !password || isLoading;
  }, [username, password, isLoading]);

  const onSubmit = useCallback(
    async (data: LoginPayload) => {
      try {
        if (isLoading) {
          return;
        }
        setLoading(true);
        setError(undefined);

        // Limpiar cualquier token previo antes de intentar login
        await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
        console.log('Login data', data);
        const response = await loginUser(data).unwrap();
        console.log('response token', response?.token);
        console.log('response role', response?.role);

        // Verificar que el usuario tenga el rol de operario
        if (response?.role !== 'ROLE_OPERARIO') {
          setLoading(false);
          setError(
            'Acceso denegado. Solo los operarios pueden acceder a esta aplicación.',
          );
          Alert.alert(
            'Acceso denegado',
            'Solo los operarios pueden acceder a esta aplicación.',
          );
          return;
        }

        await AsyncStorage.setItem(ACCESS_TOKEN_KEY, response?.token);
        setLoading(false);

        return NavigationUtil.reset({
          index: 0,
          routes: [{name: 'App'}],
        });
      } catch (_error: any) {
        setLoading(false);
        const errorMessage =
          _error?.data?.error ||
          'Error al iniciar sesión. Verifica tus credenciales.';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
        console.log('Login error:', JSON.stringify(_error));
      }
    },
    [loginUser, isLoading],
  );

  return (
    <View style={[styles.main, {backgroundColor: colors.primary}]}>
      <FastImage
        resizeMode="contain"
        source={require('../../../assets/images/marca.png')}
        style={styles.image}
      />
      <View style={[styles.bot, {backgroundColor: colors.white}]}>
        <Text
          color={colors.black}
          style={{fontSize: 22, textAlign: 'center'}}
          fw="semibold">
          Iniciar sesión
        </Text>
        <View style={styles.inputContainer}>
          <Input
            onChange={text => setValue('username', text)}
            value={username}
            label="Usuario"
            leftIcon="email"
            placeholder="Usuario"
          />

          <Input
            onChange={text => setValue('password', text)}
            value={password}
            type="password"
            label="Contraseña"
            leftIcon="padlock"
            placeholder="Contraseña"
          />
          {error && (
            <Text
              style={{width: '100%', textAlign: 'center', marginTop: 8}}
              fw="medium"
              color="red">
              {error}
            </Text>
          )}
        </View>
        <Button
          onPress={handleSubmit(onSubmit)}
          style={{marginHorizontal: 24, marginTop: 'auto'}}
          size="md"
          disabled={isDisabled}>
          {isLoading ? 'Iniciando...' : 'Iniciar'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 121,
    marginVertical: 72,
  },
  inputContainer: {
    marginTop: 48,
    gap: 24,
  },
  bot: {
    flex: 1,
    width: '100%',
    marginTop: 'auto',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
});

export default Login;
