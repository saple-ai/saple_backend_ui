import "./App.css";
import Bot from "./container/index";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./assets/theme/index";

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Routes>
            <Route path="/:id/:bot?" element={<Bot />} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
