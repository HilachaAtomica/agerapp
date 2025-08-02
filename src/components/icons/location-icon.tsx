import Svg, {G, Path, Defs, ClipPath, SvgProps} from 'react-native-svg';

function LocationIcon({color, ...props}: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M12 13a3 3 0 100-6 3 3 0 000 6z"
        stroke={color ?? '#000'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 2a8 8 0 00-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 00-8-8z"
        stroke={color ?? '#000'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default LocationIcon;
