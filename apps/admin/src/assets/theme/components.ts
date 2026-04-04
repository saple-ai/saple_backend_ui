import { Components, Theme } from "@mui/material/styles";
import palette from "./palette";

const components: Components<Theme> = {
    MuiButton: {
        styleOverrides: {
            root: {
                textTransform: 'none',
                borderRadius: 8,
                padding: '8px 16px',
                fontWeight: 500,
                fontSize: 14,
                boxShadow: 'none',
                '&:hover': {
                    boxShadow: 'none'
                }
            },
            containedPrimary: {
                backgroundColor: palette.primary?.blue,
                color: '#FFFFFF',
                '&:hover': {
                    backgroundColor: palette.primary?.blue
                }
            },
            containedSecondary: {
                backgroundColor: palette.secondary?.white,
                color: palette.primary?.blue,
                border: `1px solid ${palette.primary?.blue}`,
                '&:hover': {
                    backgroundColor: palette.secondary?.white
                }
            },
            outlinedPrimary: {
                border: `1px solid ${palette.primary?.blue}`,
                color: palette.primary?.blue,
                '&:hover': {
                    backgroundColor: 'transparent',
                    border: `1px solid ${palette.primary?.blue}`
                }
            }
        }
    },
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 8,
                    '& fieldset': {
                        borderColor: '#E0E0E0'
                    },
                    '&:hover fieldset': {
                        borderColor: palette.primary?.blue
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: palette.primary?.blue
                    }
                },
                '& .MuiInputLabel-root': {
                    color: '#666666',
                    '&.Mui-focused': {
                        color: palette.primary?.blue
                    }
                }
            }
        }
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                padding: 16
            }
        }
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: 12,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }
        }
    },
    MuiDialog: {
        styleOverrides: {
            paper: {
                borderRadius: 12
            }
        }
    }
};

export default components;
