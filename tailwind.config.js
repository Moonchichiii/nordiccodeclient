/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/templates/**/*.{js,jsx,ts,tsx}',
    './src/themes/**/*.{js,jsx,ts,tsx}',
    './src/styles/globals.css',
  ],
  
  darkMode: 'class',
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
    disableColorOpacityUtilitiesByDefault: true,
  },
  theme: {
    screens: {
      xs: '320px',
      sm: '375px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      hover: { raw: '(hover: hover)' },
      'reduced-motion': { raw: '(prefers-reduced-motion: reduce)' },
      'high-contrast': { raw: '(prefers-contrast: high)' },
      dawn: { raw: '(preference: dawn)' },
      day: { raw: '(preference: day)' },
      dusk: { raw: '(preference: dusk)' },
      night: { raw: '(preference: night)' },
    },
    extend: {
      colors: {
        dawn: {
          bg: '#f8f9fa',
          text: '#495057',
          accent: '#ff922b',
        },
        day: {
          bg: '#ffffff',
          text: '#212529',
          accent: '#228be6',
        },
        dusk: {
          bg: '#343a40',
          text: '#f8f9fa',
          accent: '#fab005',
        },
        night: {
          bg: '#212529',
          text: '#f8f9fa',
          accent: '#5c7cfa',
        },
        brand: {
          primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
            950: '#082f49',
          },
          secondary: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
            950: '#042f2e',
          },
        },
        status: {
          success: '#059669',
          error: '#dc2626',
          warning: '#d97706',
          info: '#2563eb',
        },
        security: {
          success: '#15803d',
          warning: '#b45309',
          error: '#b91c1c',
          info: '#1e40af',
        },
      },
      spacing: {
        'touch-target': '44px',
        'safe': 'env(safe-area-inset)',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      outline: {
        security: '2px solid var(--outline-security)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.gray.700'),
            '--tw-prose-headings': theme('colors.gray.900'),
            '--tw-prose-links': theme('colors.brand.primary.600'),
            '--tw-prose-bold': theme('colors.gray.900'),
            '--tw-prose-counters': theme('colors.gray.600'),
            '--tw-prose-bullets': theme('colors.gray.400'),
            '--tw-prose-hr': theme('colors.gray.300'),
            '--tw-prose-quotes': theme('colors.gray.900'),
            '--tw-prose-quote-borders': theme('colors.gray.300'),
            '--tw-prose-captions': theme('colors.gray.600'),
            '--tw-prose-code': theme('colors.gray.900'),
            '--tw-prose-pre-code': theme('colors.gray.200'),
            '--tw-prose-pre-bg': theme('colors.gray.800'),
            '--tw-prose-th-borders': theme('colors.gray.300'),
            '--tw-prose-td-borders': theme('colors.gray.200'),
            maxWidth: '65ch',
          },
        },
        dark: {
          css: {
            '--tw-prose-body': theme('colors.gray.300'),
            '--tw-prose-headings': theme('colors.white'),
            '--tw-prose-links': theme('colors.brand.primary.400'),
            '--tw-prose-bold': theme('colors.white'),
            '--tw-prose-counters': theme('colors.gray.400'),
            '--tw-prose-bullets': theme('colors.gray.600'),
            '--tw-prose-hr': theme('colors.gray.700'),
            '--tw-prose-quotes': theme('colors.gray.100'),
            '--tw-prose-quote-borders': theme('colors.gray.700'),
            '--tw-prose-captions': theme('colors.gray.400'),
            '--tw-prose-code': theme('colors.white'),
            '--tw-prose-pre-code': theme('colors.gray.300'),
            '--tw-prose-pre-bg': theme('colors.gray.800'),
            '--tw-prose-th-borders': theme('colors.gray.700'),
            '--tw-prose-td-borders': theme('colors.gray.800'),
          },
        },
      }),
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.5s ease-out forwards',
        'theme-transition': 'themeTransition 0.5s ease-in-out',
        'scroll': 'scroll 1.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scroll: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '30%': { opacity: '1' },
          '60%': { opacity: '1' },
          '100%': { transform: 'translateY(0.75rem)', opacity: '0' },
        },
      },
    },
  },
  plugins: [
    forms({ strategy: 'class' }),
    typography,
    function ({ addVariant, matchVariant }) {
      matchVariant('time', (value) => `[data-time="${value}"]`);
      addVariant('secure-hover', '&:hover:not([data-security="disabled"])');
      addVariant('secure-focus', '&:focus:not([data-security="disabled"])');
      addVariant('reduced-motion', '@media (prefers-reduced-motion: reduce)');
      addVariant('high-contrast', '@media (prefers-contrast: high)');
      addVariant('form-valid', '&[data-valid="true"]');
      addVariant('form-invalid', '&[data-invalid="true"]');
      addVariant('form-touched', '&[data-touched="true"]');
      addVariant('form-untouched', '&[data-touched="false"]');
      addVariant('form-dirty', '&[data-dirty="true"]');
      addVariant('form-pristine', '&[data-dirty="false"]');
      addVariant('form-submitted', '&[data-submitted="true"]');
      addVariant('form-processing', '&[data-processing="true"]');
    },
    function ({ addComponents }) {
      addComponents({
        '.toast': {
          '@apply rounded-lg shadow-lg p-4 mb-4': {},
          '&-success': { '@apply bg-status-success text-white': {} },
          '&-error': { '@apply bg-status-error text-white': {} },
          '&-warning': { '@apply bg-status-warning text-white': {} },
          '&-info': { '@apply bg-status-info text-white': {} },
        },
      });
    },
    function ({ addBase }) {
      addBase({
        ':root': {
          '--min-tap-target-height': '44px',
          '--outline-security': 'rgb(56, 189, 248)',
        },
        '[data-accessibility="enhanced"]': {
          '--outline-width': '3px',
          '--outline-offset': '2px',
        },
      });
    },
  ],
};
