import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function Exclamation({color, ...props}: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 6v8m.05 4v.1h-.1V18h.1z"
        stroke="#ffffffff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Exclamation;
