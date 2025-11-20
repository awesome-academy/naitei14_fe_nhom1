export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content?: Buffer | string;
  path?: string;
  contentType?: string;
}

export interface WelcomeEmailData {
  name: string;
  email: string;
  verificationLink?: string;
}

export interface OrderConfirmationEmailData {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: OrderItem[];
  total: number;
  shippingAddress: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ResetPasswordEmailData {
  name: string;
  resetLink: string;
  expirationTime: string;
}

export interface ContactFormEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export type EmailTemplateType = 
  | 'welcome'
  | 'order-confirmation'
  | 'reset-password'
  | 'order-status-update'
  | 'monthly-revenue-report';