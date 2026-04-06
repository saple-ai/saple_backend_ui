import { Theme } from '@mui/material/styles';

const style = (_theme: Theme) => ({
    height: '100vh',
    alignContent: 'baseline',
    '.wrapper': {
        height: '100%'
    },
    '.sidebarRoot': {
        position: 'relative',
        overflow: 'visible',
        flexShrink: 0,
    },
    '.mainPanel': {
        padding: '24px',
        flex: '1 1 auto',
        background: '#f8fafc',
        borderRadius: 0,
        overflowY: 'auto',
    },
    '.fullcontainer': {
        background: '#f8fafc'
    },
    '.drawericon': {
        position: 'absolute',
        top: '80px',
        background: 'white',
        boxShadow: '0px 1px 10px #7f7e7e73',
        transition: 'all 0.5s',
    }
});

export default style;
