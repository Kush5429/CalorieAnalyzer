import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// This is the entry point for the React application.
// It finds the root element and renders the App component.
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
