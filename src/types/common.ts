// Common type definitions used across the application

export interface I18nContent {
  locale: 'zh' | 'en';
  content: {
    [key: string]: string | I18nContent;
  };
}

export interface MultiLanguageContent<T> {
  zh: T;
  en: T;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: 'business' | 'collaboration' | 'general';
}

export interface NetworkError extends Error {
  status?: number;
  statusText?: string;
}

export interface ParseError extends Error {
  data?: any;
}

export interface ResourceError extends Error {
  resource?: string;
}

export interface ErrorHandlingStrategy {
  handleNetworkError(error: NetworkError): void;
  handleDataParsingError(error: ParseError): void;
  handleResourceLoadError(error: ResourceError): void;
}

export interface FallbackStrategy {
  imageFallback: string;
  staticDataFallback: any;
  reducedMotion: boolean;
}

export type Locale = 'zh' | 'en';

export interface LocaleConfig {
  code: Locale;
  name: string;
  flag: string;
}