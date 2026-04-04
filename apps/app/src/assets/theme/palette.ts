import { PaletteOptions } from "@mui/material/styles";

// Extend the PaletteOptions interface to include custom properties
interface ExtendedPaletteOptions extends PaletteOptions {
  primary?: {
    blue?: string;
    blueBg?: string;
  } & PaletteOptions['primary'];
  secondary?: {
	white?: string;
	black?: string;
  } & PaletteOptions['secondary'];
  grey?: {
	main?: string;
	icon?: string;
	border1?: string;
	border2?: string;
	} & PaletteOptions['grey'];
	textPrimary?: string;
}

const palette: ExtendedPaletteOptions = {
  primary: {
    main: '#000000',
    blue: '#238DE9',
    blueBg: '#E3EDF6'
  },
  secondary: {
    main: '#777C96',
    white: '#FFFFFF',
    black: '#000000'
  },
  grey: {
	main: '#F7F7F7',
	icon: '#777C96',
	border1: '#E4E5EA',
	border2: '#E1E1E1'
	},
  text: {
    primary: '#000000',
    secondary: '#777C96'
  },
	textPrimary: '#043927',
  background: {
    default: '#FFFFFF',
    paper: '#F4F4F4'
  },
  error: {
    main: '#D32F2F',
    light: '#EF5350',
    dark: '#C62828'
  },
  success: {
    main: '#2E7D32',
    light: '#4CAF50',
    dark: '#1B5E20'
  },
  warning: {
    main: '#ED6C02',
    light: '#FF9800',
    dark: '#E65100'
  },
  info: {
    main: '#0288D1',
    light: '#03A9F4',
    dark: '#01579B'
  }
};

export default palette;
