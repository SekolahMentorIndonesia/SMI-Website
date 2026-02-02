// Type definitions for JSX components
// *.jsx declaration removed (duplicate of global.d.ts)

// React types
// React namespace removed (using @types/react)


// NotificationContext types
interface NotificationContextType {
  notifications: any[];
  addNotification: (message: string, type?: string, duration?: number) => void;
  removeNotification: (id: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

