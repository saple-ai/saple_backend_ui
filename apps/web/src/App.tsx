import { ThemeProvider } from "@mui/material/styles";

import Routes from "./config/routingConfig.tsx"

import theme from "./assets/theme/index";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  );
}

export default App;
