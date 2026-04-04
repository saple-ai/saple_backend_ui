import { createTheme, Theme } from "@mui/material/styles";
import palette from './palette';
import typography from './typography';
import components from './components';

const theme: Theme = createTheme({
    palette,
    typography,
    components
});

export default theme;
