import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import "./index.css"
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

// Import vite-plugin-pwa helper
import { registerSW } from 'virtual:pwa-register'

// Register the service worker
registerSW({
  immediate: true, // installs SW immediately without waiting
  onNeedRefresh() {
    // optional: you can show a toast or button to refresh app
    console.log('New content available, please refresh.')
  },
  onOfflineReady() {
    console.log('App ready to work offline.')
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
  </React.StrictMode>
);

