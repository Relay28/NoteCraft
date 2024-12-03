import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          ...(darkMode
            ? {
                primary: { main: '#4caf50' },
                background: { default: '#1e2c1d', paper: '#2e3e2f' },
                text: { primary: '#d1d5db', secondary: '#9ca3af' },
              }
            : {
                primary: { main: '#5e8c31' },
                background: { default: '#f4f7ed', paper: '#fff' },
                text: { primary: '#374151', secondary: '#6b7280' },
              }),
        },
        typography: {
          fontFamily: '"Minecraftia", Arial, sans-serif', // Minecraft-inspired font
          button: { textTransform: 'none' },
          h6: { fontWeight: 'bold', fontSize: '20px' }, // Headers
        },
        shape: {
          borderRadius: 4, // Slightly blocky but modern
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: darkMode ? '#1e2c1d' : '#5e8c31',
                color: darkMode ? '#d1d5db' : '#fff',
              },
            },
          },
        },
      }),
    [darkMode]
  );

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
