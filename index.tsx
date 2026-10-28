import React from 'react';
import ReactDOM from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import App from './App';
import './src/styles/motion.css';
import { bindAbandonmentBeacon } from './src/lib/tracking';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

bindAbandonmentBeacon();

const root = ReactDOM.createRoot(rootElement);
root.render(
  <MotionConfig reducedMotion="user">
    <App />
  </MotionConfig>
);
