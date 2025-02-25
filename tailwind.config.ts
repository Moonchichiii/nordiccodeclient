import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import animate from 'tailwindcss-animate';

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/templates/**/*.{js,jsx,ts,tsx}',
    './src/themes/**/*.{js,jsx,ts,tsx}',
    './src/styles/globals.css',
  ],
  darkMode: ['class'],
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
    disableColorOpacityUtilitiesByDefault: true,
  },
  theme: {
    screens: {
      xs: '20rem',      
      sm: '23.4375rem',
      md: '48rem',      
      lg: '64rem',      
      xl: '80rem',      
      '2xl': '96rem',
      hover: { raw: '(hover: hover)' },
      'reduced-motion': { raw: '(prefers-reduced-motion: reduce)' },
      'forced-colors': { raw: '(forced-colors: active)' },
      dawn: { raw: '(preference: dawn)' },
      day: { raw: '(preference: day)' },
      dusk: { raw: '(preference: dusk)' },
      night: { raw: '(preference: night)' },
    },
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: {
          DEFAULT: 'rgb(var(--background) / <alpha-value>)',
          alt: 'rgb(var(--background-alt) / <alpha-value>)'
        },
        foreground: {
          DEFAULT: 'rgb(var(--foreground) / <alpha-value>)',
          alt: 'rgb(var(--foreground-alt) / <alpha-value>)'
        },
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          light: 'rgb(var(--primary-light) / <alpha-value>)',
          dark: 'rgb(var(--primary-dark) / <alpha-value>)'
        },
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)'
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        light: {
          bg: '#ffffff',
          text: '#000000',
          accent: '#FF6F61',
          secondary: '#6B5B95',
          tertiary: '#88B04B',
          pastel: {
            pink: '#FF9AA2',
            yellow: '#FFDAC1',
            blue: '#B5EAD7',
            purple: '#C7CEEA',
          },
        },
        dark: {
          bg: '#2A2A2A',
          text: '#FFFFFF',
          accent: '#FF6F61',
          secondary: '#6B5B95',
          tertiary: '#88B04B',
          pastel: {
            pink: '#FF9AA2',
            yellow: '#FFDAC1',
            blue: '#B5EAD7',
            purple: '#C7CEEA',
          },
        },
        brand: {
          primary: {
            50: '#F0F4FF',
            100: '#D6E4FF',
            200: '#ADC8FF',
            300: '#84A9FF',
            400: '#6690FF',
            500: '#3366FF',
            600: '#254EDB',
            700: '#1A3BB7',
            800: '#102A93',
            900: '#091C7A',
          },
          secondary: {
            50: '#FDF2F8',
            100: '#FCE7F3',
            200: '#FBCFE8',
            300: '#F9A8D4',
            400: '#F472B6',
            500: '#EC4899',
            600: '#DB2777',
            700: '#BE185D',
            800: '#9D174D',
            900: '#831843',
          },
        },
        status: {
          success: '#10B981',
          error: '#EF4444',
          warning: '#F59E0B',
          info: '#3B82F6',
        },
        security: {
          success: '#059669',
          warning: '#D97706',
          error: '#DC2626',
          info: '#2563EB',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        display: ['Monument Extended', 'Inter var', 'system-ui', 'sans-serif']
      },
      spacing: {
        'touch-target': '44px',
        'safe': 'env(safe-area-inset)',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        header: 'var(--header-height)'
      },
      maxWidth: {
        container: '80rem'
      },
      outline: {
        security: '2px solid var(--outline-security)',
      },
      transitionDuration: {
        slow: 'var(--transition-slow)',
        medium: 'var(--transition-medium)',
        fast: 'var(--transition-fast)'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.light.text'),
            '--tw-prose-headings': theme('colors.light.text'),
            '--tw-prose-links': theme('colors.brand.primary.500'),
            '--tw-prose-bold': theme('colors.light.text'),
            '--tw-prose-counters': theme('colors.gray.600'),
            '--tw-prose-bullets': theme('colors.gray.400'),
            '--tw-prose-hr': theme('colors.gray.300'),
            '--tw-prose-quotes': theme('colors.light.text'),
            '--tw-prose-quote-borders': theme('colors.gray.300'),
            '--tw-prose-captions': theme('colors.gray.600'),
            '--tw-prose-code': theme('colors.light.text'),
            '--tw-prose-pre-code': theme('colors.gray.200'),
            '--tw-prose-pre-bg': theme('colors.gray.800'),
            '--tw-prose-th-borders': theme('colors.gray.300'),
            '--tw-prose-td-borders': theme('colors.gray.200'),
            maxWidth: '65ch',
          },
        },
        dark: {
          css: {
            '--tw-prose-body': theme('colors.dark.text'),
            '--tw-prose-headings': theme('colors.dark.text'),
            '--tw-prose-links': theme('colors.brand.primary.400'),
            '--tw-prose-bold': theme('colors.dark.text'),
            '--tw-prose-counters': theme('colors.gray.400'),
            '--tw-prose-bullets': theme('colors.gray.600'),
            '--tw-prose-hr': theme('colors.gray.700'),
            '--tw-prose-quotes': theme('colors.dark.text'),
            '--tw-prose-quote-borders': theme('colors.gray.700'),
            '--tw-prose-captions': theme('colors.gray.400'),
            '--tw-prose-code': theme('colors.dark.text'),
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
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scroll: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '30%': { opacity: '1' },
          '60%': { opacity: '1' },
          '100%': { transform: 'translateY(0.75rem)', opacity: '0' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      }
    }
  },
  plugins: [
    forms({ strategy: 'class' }),
    typography,
    animate,
    function ({ addVariant, matchVariant }) {
      matchVariant('time', (value) => `[data-time="${value}"]`);
      addVariant('secure-hover', '&:hover:not([data-security="disabled"])');
      addVariant('secure-focus', '&:focus:not([data-security="disabled"])');
      addVariant('reduced-motion', '@media (prefers-reduced-motion: reduce)');
      addVariant('forced-colors', '@media (forced-colors: active)');
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
    function({ addBase }) {
      addBase({
        ':root[data-theme="light"]': {
          '--background': '255 255 255',
          '--background-alt': '250 250 250',
          '--foreground': '15 23 42',
          '--foreground-alt': '71 85 105',
          '--primary': '234 88 12',
          '--primary-light': '249 115 22',
          '--primary-dark': '194 65 12',
          '--card': '255 255 255',
          '--card-foreground': '15 23 42',
          '--muted': '241 245 249',
          '--muted-foreground': '100 116 139',
          '--min-tap-target-height': '44px',
          '--outline-security': 'rgb(56, 189, 248)',
        },
        ':root[data-theme="dark"]': {
          '--background': '15 23 42',
          '--background-alt': '30 41 59',
          '--foreground': '241 245 249',
          '--foreground-alt': '148 163 184',
          '--primary': '249 115 22',
          '--primary-light': '251 146 60',
          '--primary-dark': '234 88 12',
          '--card': '30 41 59',
          '--card-foreground': '241 245 249',
          '--muted': '51 65 85',
          '--muted-foreground': '148 163 184',
          '--min-tap-target-height': '44px',
          '--outline-security': 'rgb(56, 189, 248)',
        },
        '[data-accessibility="enhanced"]': {
          '--outline-width': '3px',
          '--outline-offset': '2px',
        },
      });
    }
  ]
} satisfies Config;