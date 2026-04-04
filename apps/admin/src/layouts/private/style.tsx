import { Theme } from '@mui/material/styles';

const style = (_theme: Theme) => ({
    height: '100vh',
    alignContent: 'baseline',
    '.wrapper': {
        height: '100%'
    },
    '.sidebarRoot': {
        overflow: 'hidden',
        transition: 'all 0.5s',
        flexShrink: 0,
    },
    '.mainPanel': {
        padding: '24px',
        flex: '1 1 auto',
        transition: 'all 0.5s',
        background: '#F4F5FE',
        borderRadius: '50px 0px 0px 50px',
        overflowY: 'auto'
    },
    '.fullcontainer': {
        background: '#043927'
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
