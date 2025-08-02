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
};

export const light: ColorScheme = {
  white: '#fff',
  black: '#000',
  primary: '#CDA16A',
  grey: '#676767',
  lightGrey: '#A8A8A9',
  darkGrey: '#2C2C2C',
  red: '#FD0100',
  halfWhite: '#F2F2F2',
  green: '#007f1b',
  yellow: '#FFC107',
};

export type ColorType = keyof ColorScheme;

export default light;
