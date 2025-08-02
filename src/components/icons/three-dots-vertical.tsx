import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function ThreeDotsVertical({color, ...props}: SvgProps) {
  return (
    <Svg
      width={props.width ?? 24}
      height={props.height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M12 16a2 2 0 110 4 2 2 0 010-4zm0-6a2 2 0 110 4 2 2 0 010-4zm0-6a2 2 0 110 4 2 2 0 010-4z"
        fill={color ?? '#000'}
      />
    </Svg>
  );
}

export default ThreeDotsVertical;
