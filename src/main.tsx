import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize theme from localStorage or system preference
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Add performance monitoring
const reportWebVitals = () => {
  if ('performance' in window && 'getEntriesByType' in performance) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const paintMetrics = performance.getEntriesByType('paint');
        const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigationTiming) {
          console.log('Page load time:', navigationTiming.loadEventEnd - navigationTiming.startTime, 'ms');
        }
        
        paintMetrics.forEach(metric => {
          console.log(`${metric.name}:`, metric.startTime, 'ms');
        });
      }, 0);
    });
  }
};

// Run theme initialization before rendering
initializeTheme();

// Monitor performance in development
if (process.env.NODE_ENV !== 'production') {
  reportWebVitals();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)