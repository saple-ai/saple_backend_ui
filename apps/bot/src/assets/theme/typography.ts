import { Theme } from '@mui/material/styles';

const typography: Theme['typography'] = {
    h1: {
        fontSize: 24,
        fontWeight: 700,
        textTransform: 'unset',
    },
    h2: {
        fontSize: 22,
        fontWeight: 700,
        textTransform: 'unset',
    },
    h3: {
        fontSize: 20,
        fontWeight: 500,
        textTransform: 'unset',
    },
    h4: {
        fontSize: 18,
        fontWeight: 700,
        textTransform: 'unset',
    },
    h5: {
        fontSize: 16,
        fontWeight: 500,
    },
    h6: {
        fontSize: 15,
        fontWeight: 400,
    },
    subtitle1: {
        fontSize: 12,
        fontWeight: 400,
    },
    subtitle2: {
        fontSize: 11,
        fontWeight: 400,
    },
    body1: {
        fontSize: 14,
        fontWeight: 400,
    },
    body2: {
        fontSize: 13,
        fontWeight: 400,
    },
    button: {
        fontSize: 16,
        fontWeight: 500,
    },
    caption: {
        fontSize: 14,
        fontWeight: 400,
        textTransform: 'uppercase',
        paddingBottom: 5
    },
    overline: {
        fontFamily: 'Public Sans, sans-serif',
        fontSize: 14,
        fontWeight: 500,
        textTransform: 'uppercase',
    },
    fontFamily: undefined,
    fontSize: 0,
    fontWeightLight: undefined,
    fontWeightRegular: undefined,
    fontWeightMedium: undefined,
    fontWeightBold: undefined,
    htmlFontSize: 0,
    pxToRem: function (px: number): string {
        return `${px / 16}rem`;
    }
};

export default typography;
