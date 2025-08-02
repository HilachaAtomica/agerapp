import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../screens/root';
import Login from '../screens/auth/login';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type RootScreenProps = NativeStackScreenProps<RootStackParamList, 'Auth'>;

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigation = (_props: RootScreenProps) => {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <AuthStack.Screen component={Login} name="Login" />
    </AuthStack.Navigator>
  );
};

export default AuthNavigation;
