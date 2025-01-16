import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import './styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';

function initGSAP() {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother);

  // Configure GSAP defaults for better performance
  gsap.config({
    nullTargetWarn: false,
    autoSleep: 60,
    force3D: true,
    units: { left: '%', top: '%', rotation: 'rad' }
  });

  // Initialize ScrollSmoother with optimized settings
  ScrollSmoother.create({
    smooth: 1.5,
    effects: true,
    smoothTouch: 0.1,
    normalizeScroll: true,
    ignoreMobileResize: true,
  });

  // Set up global ScrollTrigger defaults
  ScrollTrigger.defaults({
    markers: false,
    preventOverlaps: true,
    fastScrollEnd: true,
  });

  // Clear markers in production
  if (process.env.NODE_ENV === 'production') {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}

// Initialize GSAP before rendering
initGSAP();

// Optimize root render
const container = document.getElementById('root')!;
const root = createRoot(container);

// Disable StrictMode in production for better performance
export const AppWrapper = process.env.NODE_ENV === 'production' 
  ? App 
  : () => (
    <StrictMode>
      <App />
    </StrictMode>
  );

root.render(<AppWrapper />);
