import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import './styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';

// Basic GSAP setup for future implementations
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const container = document.getElementById('root')!;
const root = createRoot(container);

const AppWrapper = import.meta.env.MODE === 'production' ? App : () => (
  <StrictMode>
    <App />
  </StrictMode>
);

root.render(<AppWrapper />);