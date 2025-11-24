export type ColorScheme = {
  white: string;
  black: string;
  primary: string;
  grey: string;
  lightGrey: string;
  darkGrey: string;
  red: string;
  halfWhite: string;
  green: string;
  yellow: string;
  orange: string;
};

export const light: ColorScheme = {
  white: '#fff',
  black: '#000',
  primary: '#CDA16A',
  grey: '#4A4A4A',
  lightGrey: '#7A7A7A',
  darkGrey: '#1A1A1A',
  red: '#FD0100',
  halfWhite: '#F2F2F2',
  green: '#007f1b',
  yellow: '#FFC107',
  orange: '#FF8C00',
};

export type ColorType = keyof ColorScheme;

export default light;
