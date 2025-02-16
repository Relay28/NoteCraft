import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Global styles
import App from './App.jsx'; // Main App component
import { BrowserRouter } from 'react-router-dom'; // React Router for routing
import { PersonalInfoProvider } from './components/PersonalInfoProvider'; // Context for personal info
import { CustomThemeProvider } from './components/ThemeProvider'; // Theme context provider

// Render the app
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CustomThemeProvider> {/* Provides theme context */}
      <PersonalInfoProvider> {/* Provides personal info context */}
        <BrowserRouter> {/* Handles routing */}
          <App /> {/* The main application */}
        </BrowserRouter>
      </PersonalInfoProvider>
    </CustomThemeProvider>
  </StrictMode>
);
