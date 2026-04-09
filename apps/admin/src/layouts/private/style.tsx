import { Theme } from '@mui/material/styles';

const style = (_theme: Theme) => ({
    height: '100vh',
    padding: '16px',
    boxSizing: 'border-box',
    background: '#f8fafc',
    alignContent: 'baseline',
    '.wrapper': {
        height: '100%'
    },
    '.sidebarRoot': {
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.5s',
        flexShrink: 0,
        marginRight: '16px',
    },
    '.mainPanel': {
        padding: '24px',
        flex: '1 1 auto',
        transition: 'all 0.5s',
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid rgba(0,0,0,0.06)',
        overflowY: 'auto'
    },
    '.fullcontainer': {
        background: '#f8fafc',
        height: 'calc(100vh - 32px)'
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
