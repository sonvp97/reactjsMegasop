import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useMemo } from "react";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import { themeSettings } from "theme";
import { useSelector } from "react-redux";
import Search from "scenes/hasaki/search";
import List from "scenes/hasaki/list";
import SearchPharmacity from "scenes/pharmacity/searchPharmacity";
import ListPharmacity from "scenes/pharmacity/listPharmacity";


function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/hasaki/search" element={<Search />} />
              <Route path="/hasaki" element={<List />} />
              <Route path="/pharmacity/search" element={<SearchPharmacity />} />
              <Route path="/pharmacity" element={<ListPharmacity />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
