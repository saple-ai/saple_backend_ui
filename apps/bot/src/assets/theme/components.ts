import { Components } from '@mui/material/styles';
import palette from "./palette";
// import typography from "./typography";

const components: Components = {
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 4,
                textTransform: 'none'
            },
        },
    },
    MuiLink: {
        styleOverrides: {
            root: {
                cursor: 'pointer',
                // fontFamily: typography.body1.fontFamily,
                fontSize: '14px',
                textAlign: 'center'
            }
        }
    },
    MuiTextField: {},
    MuiOutlinedInput: {
        styleOverrides: {
            root: {},
            notchedOutline: {
                borderColor: '#EAEAF3'
            }
        }
    },
    MuiTableContainer: {
        styleOverrides: {
            root: {
                boxShadow: 'none'
            }
        }
    },
    MuiTypography: {
        styleOverrides: {
            root: {
                color: palette.text?.primary
            }
        }
    }
};

export default components;
