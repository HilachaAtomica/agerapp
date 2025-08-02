import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function PhoneIcon({color, ...props}: SvgProps) {
  return (
    <Svg
      width={props.width ?? 24}
      height={props.height ?? 24}
      viewBox="0 0 24 24"
      fill="none">
      <Path
        d="M8 3c.5 0 2.5 4.5 2.5 5 0 1-1.5 2-2 3s.5 2 1.5 3c.39.39 2 2 3 1.5s2-2 3-2c.5 0 5 2 5 2.5 0 2-1.5 3.5-3 4s-2.5.5-4.5 0-3.5-1-6-3.5-3-4-3.5-6-.5-3 0-4.5 2-3 4-3z"
        stroke={color ?? '#626262'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default PhoneIcon;
