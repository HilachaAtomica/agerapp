import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function HomeFilledIcon({color, ...props}: SvgProps) {
  return (
    <Svg
      width={props.width ?? 24}
      height={props.height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M2.25 12l8.955-8.955a1.124 1.124 0 011.59 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25-8.25z"
        fill={color ?? '#FFFEFA'}
      />
      <Path
        d="M2.25 12l8.955-8.955a1.124 1.124 0 011.59 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        stroke={color ?? '#FFFEFA'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path fill={color ?? '#FFFEFA'} d="M5 9H19V12H5z" />
    </Svg>
  );
}

export default HomeFilledIcon;
