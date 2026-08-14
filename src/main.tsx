/// <reference types="vite/client" />
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';

// --- Data Isolation Interceptors --- //
// 1. Fetch Interceptor
const originalFetch = window.fetch;
Object.defineProperty(window, 'fetch', {
  configurable: true,
  enumerable: true,
  writable: true,
  value: async (input: RequestInfo | URL, init: RequestInit = {}) => {
    try {
      const mergedHeaders: Record<string, string> = {};
      if (init.headers) {
        if (typeof Headers !== 'undefined' && init.headers instanceof Headers) {
          init.headers.forEach((value, key) => {
            mergedHeaders[key] = value;
          });
        } else if (Array.isArray(init.headers)) {
          init.headers.forEach(([key, value]) => {
            mergedHeaders[key] = value;
          });
        } else if (typeof init.headers === 'object') {
          Object.assign(mergedHeaders, init.headers);
        }
      }

      const userInfoRaw = localStorage.getItem('user_info');
      if (userInfoRaw) {
        try {
          const userInfo = JSON.parse(userInfoRaw);
          if (userInfo?.email) {
            mergedHeaders['x-user-email'] = userInfo.email;
            mergedHeaders['x-user-role'] = userInfo.role || 'user';
          }
        } catch (e) {}
      }

      const customApiKeysRaw = localStorage.getItem('custom_api_keys');
      if (customApiKeysRaw) {
        mergedHeaders['x-custom-api-keys'] = encodeURIComponent(customApiKeysRaw);
      }

      init.headers = mergedHeaders;
    } catch (e) {
      console.error('Error in fetch interceptor', e);
    }
    return originalFetch(input, init);
  }
});

// 2. LocalStorage Interceptor for Multi-Tenant Data Isolation
const originalSetItem = localStorage.setItem;
const originalGetItem = localStorage.getItem;
const originalRemoveItem = localStorage.removeItem;

const getIsolatedKey = (key: string) => {
  // Global keys that should NOT be scoped by user
  const globalKeys = [
    'user_info', 
    'auth_token', 
    'custom_api_keys', 
    'user_access_info', 
    'app_users_db', 
    'user_thesis_projects_list',
    'active_thesis_data',
    'thesis_guidelines',
    'dukun_skripsi_telemetry_errors'
  ];
  if (globalKeys.includes(key)) return key;

  try {
    const userInfoRaw = originalGetItem.call(localStorage, 'user_info');
    if (userInfoRaw) {
      const userInfo = JSON.parse(userInfoRaw);
      if (userInfo?.role === 'admin') {
         // Admin can see a default global view or their own view, but let's scope them to admin
         return `${key}_admin`;
      }
      if (userInfo?.email) {
        return `${key}_${userInfo.email}`;
      }
    }
  } catch (e) {}
  
  return key;
};

localStorage.setItem = function(key, value) {
  return originalSetItem.call(localStorage, getIsolatedKey(key), value);
};
localStorage.getItem = function(key) {
  return originalGetItem.call(localStorage, getIsolatedKey(key));
};
localStorage.removeItem = function(key) {
  return originalRemoveItem.call(localStorage, getIsolatedKey(key));
};
// ----------------------------------- //

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'placeholder-client-id.apps.googleusercontent.com'}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
