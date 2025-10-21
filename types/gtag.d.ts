// Google Analytics gtag type definitions
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: {
        page_path?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
        custom_map?: Record<string, string>;
        [key: string]: any;
      }
    ) => void;
  }
}

export {};
