import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function CameraIcon({color, ...props}: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M20 4h-3.17L15 2H9L7.17 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 14H4V6h4.05l1.83-2h4.24l1.83 2H20v12zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6z"
        fill={color ?? '#000'}
      />
    </Svg>
  );
}

export default CameraIcon;
