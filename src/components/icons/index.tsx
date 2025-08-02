import {useMemo} from 'react';
import {SvgProps} from 'react-native-svg';
import HomeIcon from './home';
import HomeFilledIcon from './home-filled';
import AccountIcon from './account';
import AccountFilledIcon from './account-filled';
import TrashIcon from './trash';
import CalendarIcon from './calendar';
import CalendarFilledIcon from './calendar-filled';
import EmailIcon from './email-icon';
import PadlockIcon from './padlock-icon';
import EyeOpenIcon from './eye-open';
import EyeCloseIcon from './eye-close';
import ArrowLeftIcon from './arrow-left';
import ArrowRightIcon from './arrow-right';
import CheckIcon from './check-icon';
import ClockIcon from './clock';
import CloseIcon from './close';
import PhoneIcon from './phone-icon';
import UserIcon from './user-icon';
import LocationIcon from './location-icon';
import ThreeDotsVertical from './three-dots-vertical';
import WhatsappIcon from './whatsapp';
import PlusIcon from './plus';
import LogoutIcon from './logout';
import ChangePasswordIcon from './change-password';
import NotificationsIcon from './notifications';
import HistoryIcon from './history';
import GalleryIcon from './gallery';
import CameraIcon from './camera';
import FileIcon from './file';

export type IconNameProp =
  | 'home'
  | 'homeFilled'
  | 'account'
  | 'accountFilled'
  | 'calendar'
  | 'calendarFilled'
  | 'trash'
  | 'email'
  | 'padlock'
  | 'eyeOpen'
  | 'eyeClose'
  | 'arrowLeft'
  | 'arrowRight'
  | 'check'
  | 'clock'
  | 'close'
  | 'phone'
  | 'user'
  | 'location'
  | 'threeDotsVertical'
  | 'whatsapp'
  | 'plus'
  | 'logout'
  | 'changePassword'
  | 'notification'
  | 'history'
  | 'gallery'
  | 'camera'
  | 'file';

type AppIconProps = {
  name: IconNameProp;
  size?: number;
  color?: string;
};

const AppIcon = ({name, size = 30, color}: AppIconProps) => {
  const iconsProps: SvgProps = useMemo(
    () => ({
      color,
      width: size,
      height: size,
    }),
    [color, size],
  );

  const icons = useMemo(
    () => ({
      home: <HomeIcon {...iconsProps} />,
      homeFilled: <HomeFilledIcon {...iconsProps} />,
      account: <AccountIcon {...iconsProps} />,
      accountFilled: <AccountFilledIcon {...iconsProps} />,
      calendar: <CalendarIcon {...iconsProps} />,
      calendarFilled: <CalendarFilledIcon {...iconsProps} />,
      trash: <TrashIcon {...iconsProps} />,
      email: <EmailIcon {...iconsProps} />,
      padlock: <PadlockIcon {...iconsProps} />,
      eyeOpen: <EyeOpenIcon {...iconsProps} />,
      eyeClose: <EyeCloseIcon {...iconsProps} />,
      arrowLeft: <ArrowLeftIcon {...iconsProps} />,
      arrowRight: <ArrowRightIcon {...iconsProps} />,
      check: <CheckIcon {...iconsProps} />,
      clock: <ClockIcon {...iconsProps} />,
      close: <CloseIcon {...iconsProps} />,
      phone: <PhoneIcon {...iconsProps} />,
      user: <UserIcon {...iconsProps} />,
      location: <LocationIcon {...iconsProps} />,
      threeDotsVertical: <ThreeDotsVertical {...iconsProps} />,
      whatsapp: <WhatsappIcon {...iconsProps} />,
      plus: <PlusIcon {...iconsProps} />,
      logout: <LogoutIcon {...iconsProps} />,
      changePassword: <ChangePasswordIcon {...iconsProps} />,
      notification: <NotificationsIcon {...iconsProps} />,
      history: <HistoryIcon {...iconsProps} />,
      gallery: <GalleryIcon {...iconsProps} />,
      camera: <CameraIcon {...iconsProps} />,
      file: <FileIcon {...iconsProps} />,
    }),
    [iconsProps],
  );

  return icons[name];
};

export default AppIcon;
