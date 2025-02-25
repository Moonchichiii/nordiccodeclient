// src/components/BuildingLoader.tsx
import { gsap } from 'gsap';

export interface LoaderOptions {
  container?: HTMLElement;
  textColor?: string;
  fontSize?: string;
  shimmerColor?: string;
  animationDuration?: number;
}

class BuildingLoader {
  private options: LoaderOptions;
  private letters: HTMLSpanElement[] = [];
  private progressElement: HTMLDivElement;
  private loaderContainer: HTMLDivElement;
  private timeline: gsap.core.Timeline;

  constructor(options: LoaderOptions = {}) {
    this.options = {
      textColor: '#00ff88',
      fontSize: '3rem',
      shimmerColor: 'rgba(255,255,255,0.4)',
      animationDuration: 3,
      ...options
    };
    this.timeline = gsap.timeline();
  }

  initialize() {
    this.createLoader();
    this.animateLetters();
    this.animateProgress();
  }

  private createLoader() {
    this.loaderContainer = document.createElement('div');
    this.loaderContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: rgba(0,0,0,0.9);
      z-index: 1000;
    `;

    const text = 'BUILDING';
    const textContainer = document.createElement('div');
    textContainer.style.position = 'relative';

    // Create animated letters
    text.split('').forEach((char) => {
      const letter = document.createElement('span');
      letter.textContent = char;
      letter.style.cssText = `
        color: ${this.options.textColor};
        font-size: ${this.options.fontSize};
        font-family: monospace;
        font-weight: bold;
        opacity: 0;
        display: inline-block;
        text-shadow: 0 0 10px ${this.options.shimmerColor};
      `;
      this.letters.push(letter);
      textContainer.appendChild(letter);
    });

    // Create progress bar
    this.progressElement = document.createElement('div');
    this.progressElement.style.cssText = `
      width: 200px;
      height: 4px;
      background: #333;
      margin-top: 20px;
      border-radius: 2px;
      overflow: hidden;
    `;

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      width: 0%;
      height: 100%;
      background: ${this.options.textColor};
      transition: width 0.3s ease;
    `;
    this.progressElement.appendChild(progressBar);

    this.loaderContainer.appendChild(textContainer);
    this.loaderContainer.appendChild(this.progressElement);

    const container = this.options.container || document.body;
    container.appendChild(this.loaderContainer);
  }

  private animateLetters() {
    this.timeline.to(this.letters, {
      duration: 0.5,
      opacity: 1,
      scale: 1.2,
      stagger: 0.1,
      ease: 'back.out',
      onComplete: () => {
        this.createShimmerEffect();
      }
    });
  }

  private createShimmerEffect() {
    this.timeline.to(this.letters, {
      duration: 1.5,
      repeat: -1,
      backgroundImage: `linear-gradient(90deg, transparent, ${this.options.shimmerColor}, transparent)`,
      backgroundClip: 'text',
      backgroundSize: '200% 100%',
      backgroundPositionX: '200%',
      ease: 'none'
    }, '+=0.5');
  }

  private animateProgress() {
    gsap.to(this.progressElement.firstChild as HTMLDivElement, {
      width: '100%',
      duration: this.options.animationDuration,
      repeat: -1,
      ease: 'power2.inOut',
      yoyo: true
    });
  }

  destroy() {
    this.timeline.kill();
    this.loaderContainer.remove();
  }
}

export default BuildingLoader;