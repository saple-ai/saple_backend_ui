const style = () => ({
    '.titleContainer': {

    },
    '.title': {
        display: 'flex',
        alignItems: 'end',
    },
    '.userSetting': {
        width: '100px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end',
    },
    '.container': {
        margin: '0px'
    },
    '.chartContainer': {
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0px 1px 16px #ccc'
    },
    '.iconContainer': {
        height: '50px',
        width: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%'
    },
    '.css-1ilywbq-MuiButtonBase-root-MuiButton-root.Mui-disabled': {
        color: 'rgba(0, 0, 0, 1)',
        border: '5px solid rgba(0, 0, 0, 0.12)'
    },
    '.customTabs': {
        '.tabBody': {
            background: '#FFFFFF',
            boxShadow: '0px 0px 6px #0000000F',
            border: `1px solid #EDEDF5`,
            borderTop: 'none',
            borderRadius: '0px 10px 10px',
            padding: '24px',
            '& .MuiTableCell-head': {
                background: '#fff !important'
            }
        },
        '.MuiTab-root': {
            border: `1px solid #E6E7F6`,
            background: `#FCFCFE`,
            borderRadius: '10px 10px 0px 0px',
            padding: '8px 15px 2px 15px',
            textTransform: 'unset',
            marginRight: '14px',
            fontSize: '14px',
            fontWeight: 400,
            '.MuiTypography-root': {
                color: '#9FA5D2'
            },
            '&.Mui-selected': {
                background: '#fff',
                borderBottom: `1px solid transparent`,
                color: '#000000',
                fontWeight: '600',
                '.MuiTypography-root': {
                    color: '#000000',
                    fontWeight: '600',
                },
            }
        },
        '.MuiTabPanel-root': {
            padding: '30px'
        },
        '.MuiTabs-indicator': {
            display: 'none'
        }
    }

})
export default style;