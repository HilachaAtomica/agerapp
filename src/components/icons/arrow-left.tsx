import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function ArrowLeftIcon({color, ...props}: SvgProps) {
  return (
    <Svg
      width={props.width ?? 24}
      height={props.height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M14 7l-5 5 5 5"
        stroke={color ?? '#FFFEFA'}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default ArrowLeftIcon;
