import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function CalendarFilledIcon({color, ...props}: SvgProps) {
  return (
    <Svg
      width={props.width ?? 24}
      height={props.height ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        d="M21 20V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2zM9 18H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm2-5H5V7h14v2z"
        fill={color ?? '#fff'}
      />
    </Svg>
  );
}

export default CalendarFilledIcon;
