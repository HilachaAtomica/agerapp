import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function ClockIcon({color, ...props}: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 21a9 9 0 100-18 9 9 0 000 18z"
        stroke={color ?? '#fff'}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11 8v5h5"
        stroke={color ?? '#fff'}
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ClockIcon;
