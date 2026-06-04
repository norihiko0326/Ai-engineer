import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import './index.css'
import App from './App.tsx'
import { TaskProvider } from './context/TaskContext'

console.log('main.tsx loaded');

const theme = createTheme({
  palette: {
    background: {
      default: '#f5f5f5',
    },
  },
});

function renderApp() {
  const rootElement = document.getElementById('root');
  console.log('renderApp called, rootElement:', rootElement);

  if (rootElement) {
    try {
      createRoot(rootElement).render(
        <StrictMode>
          <ThemeProvider theme={theme}>
            <TaskProvider>
              <App />
            </TaskProvider>
          </ThemeProvider>
        </StrictMode>,
      );
      console.log('React app rendered successfully');
    } catch (error) {
      console.error('Error rendering React app:', error);
    }
  } else {
    console.error('Root element not found');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
