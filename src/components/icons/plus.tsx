import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function PlusIcon({color, ...props}: SvgProps) {
  return (
    <Svg
      width={props.width ?? 24}
      height={props.height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M18 12.998h-5v5a1 1 0 01-2 0v-5H6a1 1 0 010-2h5v-5a1 1 0 012 0v5h5a1 1 0 110 2z"
        fill={color ?? '#000'}
      />
    </Svg>
  );
}

export default PlusIcon;
