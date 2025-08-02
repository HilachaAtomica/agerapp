import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function FileIcon({color, ...props}: SvgProps) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
      <Path
        d="M24 2.667a2.667 2.667 0 012.667 2.666v15.448c0 .707-.282 1.386-.782 1.886L20 28.552c-.5.5-1.178.781-1.885.781H8a2.667 2.667 0 01-2.667-2.666V5.333A2.667 2.667 0 018 2.667h16zm0 2.666H8v21.334h8v-6a2 2 0 012-2h6V5.333zm-.552 16h-4.781v4.782l4.781-4.782zm-10.115-6.666a1.333 1.333 0 010 2.666H12a1.334 1.334 0 010-2.666h1.333zM20 9.333A1.333 1.333 0 1120 12h-8a1.333 1.333 0 010-2.667h8z"
        fill={color ?? '#000'}
      />
    </Svg>
  );
}

export default FileIcon;
