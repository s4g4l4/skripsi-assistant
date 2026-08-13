import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
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
    const userInfoRaw = localStorage.getItem('user_info');
    if (userInfoRaw) {
      const userInfo = JSON.parse(userInfoRaw);
      if (userInfo?.email) {
        init.headers = {
          ...init.headers,
          'x-user-email': userInfo.email,
          'x-user-role': userInfo.role || 'user'
        };
      }
    }
  } catch (e) {
    console.error('Error parsing user_info for fetch interceptor', e);
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
    'user_thesis_projects_list'
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
  return originalSetItem.call(this, getIsolatedKey(key), value);
};
localStorage.getItem = function(key) {
  return originalGetItem.call(this, getIsolatedKey(key));
};
localStorage.removeItem = function(key) {
  return originalRemoveItem.call(this, getIsolatedKey(key));
};
// ----------------------------------- //

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
