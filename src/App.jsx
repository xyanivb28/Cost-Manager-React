import { useState } from "react";
import { darkTheme, lightTheme } from "./theme";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import AddCost from "./components/AddCost.jsx";
import Summary from "./components/Summary.jsx";
import Report from "./components/Report.jsx";
import {ModeSwitchButton} from "./components/ModeSwitchButton.jsx";
import { idb } from "./idb_modules.js";

// Initiate connection to idb:
await idb.openCostsDB("costsdb",1);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />

      <Box>
        <Grid container direction="row" sx={{
          justifyContent: 'space-evenly',
          gap: '1rem',
          margin: '1rem'
        }}>
          <AddCost />
          <Summary />
          <Report />
        </Grid>

        {/* Toggle Theme Mode Button */}
        <ModeSwitchButton onClick={toggleTheme} isDarkMode={isDarkMode} />

      </Box>
    </ThemeProvider>
  );
}

export default App;
