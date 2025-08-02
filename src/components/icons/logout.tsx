import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function LogoutIcon({color, ...props}: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M5 21c-.55 0-1.02-.196-1.412-.587A1.93 1.93 0 013 19V5c0-.55.196-1.02.588-1.412A1.93 1.93 0 015 3h7v2H5v14h7v2H5zm11-4l-1.375-1.45 2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5-5 5z"
        fill={color ?? '#FE4848'}
      />
    </Svg>
  );
}

export default LogoutIcon;
