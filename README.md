# Nordic Code Works - Frontend

[Live Project Link](Coming Soon!)
[Backend Repository Link]()

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Features](#features)
6. [Development](#development)
7. [Build](#build)

## Overview

The Nordic Code Works frontend is built with React, TypeScript, and Vite, featuring a modern and responsive design. This application serves as the client-side interface for managing project orders and interacting with the bilingual chatbot system.

## Tech Stack

### Core
- React 18
- TypeScript
- Vite 6
- React Router DOM

### State Management & Data Fetching
- TanStack React Query
- React Hook Form
- Zod for validation

### Styling & Animation
- TailwindCSS
- GSAP Business
- SplitType

### Communication
- Axios
- EmailJS
- React Toastify

### Development Tools
- ESLint
- Prettier
- TypeScript ESLint
- PostCSS
- Autoprefixer

## Getting Started

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```plaintext
src/
├── assets/        # Static assets
├── components/    # Reusable components
├── config/        # Configuration files
├── features/      # Feature-based modules
├── hooks/         # Custom React hooks
├── layouts/       # Layout components
├── lib/           # Utility functions
├── pages/         # Page components
├── services/      # API services
├── store/         # State management
├── styles/        # Global styles
├── types/         # TypeScript types
└── utils/         # Helper functions
```

## Features

- Modern React with TypeScript
- Fast development with Vite
- Responsive design with TailwindCSS
- Form handling with React Hook Form & Zod
- API integration with TanStack Query
- Smooth animations with GSAP
- Email integration with EmailJS
- Comprehensive ESLint configuration
- Code formatting with Prettier
- Type safety with TypeScript

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Type checking
npm run tsc

# Linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### ESLint Configuration

The project uses a comprehensive ESLint setup with:
- TypeScript ESLint
- React specific rules
- JSX accessibility rules
- React Hooks rules
- Prettier integration

### Styling

- TailwindCSS with custom configuration
- Typography plugin
- Forms plugin
- PostCSS processing
- Autoprefixer

## Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### Build Output

The build process:
1. Runs TypeScript compilation
2. Bundles assets with Vite
3. Optimizes for production
4. Generates static files in `dist/`

## Environment Variables

Create a `.env` file in the root directory:

```plaintext
VITE_API_URL=your_api_url
VITE_EMAIL_SERVICE_ID=your_emailjs_service_id
VITE_EMAIL_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAIL_PUBLIC_KEY=your_emailjs_public_key
```

[Back to top](#nordic-code-works---frontend)