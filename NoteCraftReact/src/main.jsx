import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { PersonalInfoProvider } from './components/PersonalInfoProvider';  // Import the provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PersonalInfoProvider>  {/* Wrap App with PersonalInfoProvider */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersonalInfoProvider>
  </StrictMode>
);
