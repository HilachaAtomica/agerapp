import Svg, {Path, SvgProps} from 'react-native-svg';

const CheckIcon = ({color, ...props}: SvgProps) => {
  return (
    <Svg fill="none" width={16} height={16} viewBox="0 0 16 16" {...props}>
      <Path
        d="M6.367 10.587l5.868-5.868a.339.339 0 01.229-.103.314.314 0 01.242.103c.074.074.11.153.11.238a.332.332 0 01-.11.238l-5.962 5.967a.517.517 0 01-.754 0l-2.7-2.7a.323.323 0 01.004-.476.332.332 0 01.237-.11c.085 0 .165.037.238.11l2.598 2.601z"
        fill={color ?? '#fff'}
      />
    </Svg>
  );
};

export default CheckIcon;
