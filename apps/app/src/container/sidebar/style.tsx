const style = () => ({
    height: '100%',
    '.sidebarContainer': {
        flex: 1,
        height: '100%',
        justifyContent: 'space-between',
        padding: '0px 0px 25px'
    },
    '.logoContainer': {
        paddingBottom: '16px'
    },
    '.menuItems': {
        width: '100%',
        '& .MuiMenuItem-root': {
            borderRadius: '6px',
            marginBottom: '15px',
            '&.active': {
                background: '#238DE9',
                '& .MuiListItemIcon-root': {
                    background: '#004D6C'
                }
            },
            '&:hover': {

            },
            '& .MuiListItemIcon-root': {
                justifyContent: 'center',
                alignItems: 'center',
                width: '45px',
                height: '45px',
                borderRadius: '45px',
                marginRight: '20px'

            }
        },

    },
    '.activeLink': {
        borderLeft: '3px solid #fff',
        background: 'linear-gradient(90deg, #ffffff66, #e5000000 117%)'
    },
    '.inactiveLink': {
        borderLeft: '3px solid transparent',
    },
    '.active': {

        '& .fillPath': {
            fill: '#fff'
        },
        '& .fillStroke': {
            stroke: '#fff'
        }
    },
    '.inactive': {

        '& .fillPath': {
            fill: '#ffffff99'
        },
        '& .fillStroke': {
            stroke: '#ffffff99'
        }
    },
    '.activetxt': {
        color: '#ffffff',
        fontWeight: 'bold'
    },
    '.inactivetxt': {
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: 'bold'

    },
    '.footer': {
        width: '80px'
    },
    '.logo': {
        marginTop: '20px'
    }
})
export default style;