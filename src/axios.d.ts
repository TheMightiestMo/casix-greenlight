import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    meta?: {
      startTime: Date;
    };
  }

  export interface AxiosResponse {
    duration?: number;
  }
}
