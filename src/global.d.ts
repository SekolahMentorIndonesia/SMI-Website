/// <reference types="react" />

declare module 'virtual:load-fonts.jsx' {
  export function LoadFonts(): null;
}

declare module 'react-router' {
  interface AppLoadContext {
    // add context properties here
  }
}

// Type definitions for JSX components
declare module '*.jsx' {
  const value: any;
  export default value;
}

// Fix for React Router generated types
// Relative module declarations removed to fix TS error

