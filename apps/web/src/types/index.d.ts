// Type definitions for JSX components

declare module '*.jsx' {
  const value: any;
  export default value;
}

// React types
declare namespace React {
  interface FC<P = {}> {
    (props: P): React.ReactElement<any, any> | null;
  }
}

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

declare module '../contexts/NotificationContext' {
  const NotificationProvider: React.FC<{ children: React.ReactNode }>;
  const useNotification: () => NotificationContextType;
  export { NotificationProvider, useNotification };
  export default NotificationProvider;
}

declare module '../components/NotificationContainer' {
  const NotificationContainer: React.FC;
  export default NotificationContainer;
}

declare module '../components/AuthInitializer' {
  const AuthInitializer: React.FC<{ children: React.ReactNode }>;
  export default AuthInitializer;
}
