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
                primary: { main: '#4caf50' }, // Calming teal/blue accent
                background: { default: '#2b2f3a', paper: '#383e4a' }, // Neutral dark tones
                text: { primary: '#d8dee9', secondary: '#a1a9b3' }, // Readable grays
                secondary: { main: '#d4af37' }, // Subtle gold accent
                h2: { color: darkMode ? '#ffff' : '#000' },
              }
            : {
                primary: { main: '#4caf50' }, // Fresh green for light mode
                background: { default: '#f4f7ed', paper: '#fff' }, // Light and airy
                text: { primary: '#374151', secondary: '#6b7280' }, // Gray tones
                secondary: { main: '#8d6e63' }, // Soft brown
              }),
        },
        typography: {
          fontFamily: '"Minecraftia", Arial, sans-serif', // Minecraft-inspired font
          button: { textTransform: 'none' },
          h6: { fontWeight: 'bold', fontSize: '20px' }, // Headers
          body1: { color: darkMode ? '#000' : '#000' },
          h5: { color: darkMode ? '#000' : '#000' },
          h4: { color: darkMode ? '#000' : '#000' },
          h2: { color: darkMode ? '#fff' : '#000' },
          
        },
        shape: {
          borderRadius: 4, // Slightly blocky but modern
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: darkMode ? '#383e4a' : '#4caf50',
                color: darkMode ? '#d8dee9' : '#fff',
              },
            },
          },
          MuiBox: {
            styleOverrides: {
              root: {
                backgroundColor: darkMode ? '#2b2f3a' : '#f4f7ed',
                color: darkMode ? '#d8dee9' : '#374151',
                backgroundImage: darkMode
                  ? `radial-gradient(circle, rgba(255, 255, 255, 0.05) 2px, transparent 2px),
                     radial-gradient(circle, rgba(135, 206, 250, 0.05) 2px, transparent 2px)`
                  : 'none', // Subtle starry effect for dark mode
                backgroundSize: darkMode ? '60px 60px, 90px 90px' : 'none',
                backgroundPosition: darkMode ? '0 0, 30px 30px' : 'none',
              },
            },
          },
        },
      }),
    [darkMode]
  );

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, theme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
