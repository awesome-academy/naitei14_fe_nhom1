import { WelcomeEmailData, OrderConfirmationEmailData, ResetPasswordEmailData } from "../types/email";
import { v4 as uuidv4 } from 'uuid';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateEmails = (emails: string[]): { valid: string[]; invalid: string[] } => {
  const valid: string[] = [];
  const invalid: string[] = [];

  emails.forEach(email => {
    const trimmedEmail = email.trim();
    if (isValidEmail(trimmedEmail)) {
      valid.push(trimmedEmail);
    } else {
      invalid.push(trimmedEmail);
    }
  });

  return { valid, invalid };
};

export const formatEmailList = (emails: string | string[]): string => {
  if (typeof emails === 'string') {
    return emails;
  }
  return emails.join(', ');
};

export const generateResetPasswordLink = (token: string, baseUrl?: string): string => {
  const base = baseUrl || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return `${base}/reset-password?token=${token}`;
};

export const generateVerificationLink = (token: string, baseUrl?: string): string => {
  const base = baseUrl || process.env.NEXTAUTH_URL || 'http://localhost:3000';
  return `${base}/verify-email?token=${token}`;
};

export const formatCurrency = (amount: number, currency: string = 'VND'): string => {
  if (currency === 'VND') {
    return amount.toLocaleString('vi-VN') + '₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatEmailDate = (date: Date | string, locale: string = 'vi-VN'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const truncateText = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
};

export const htmlToPlainText = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .replace(/\s+/g, ' ')
    .trim();
};

export const generateOrderNumber = (): string => {
  const uniqueId = uuidv4().split('-')[0].toUpperCase();
  return `ORD-${uniqueId}`;
};

export const isEmailConfigured = (): boolean => {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
};

export const validateWelcomeEmailData = (data: WelcomeEmailData): boolean => {
  return !!(data.name && data.email);
};

export const validateOrderEmailData = (data: OrderConfirmationEmailData): boolean => {
  return !!(
    data.customerName &&
    data.orderNumber &&
    data.orderDate &&
    data.items &&
    Array.isArray(data.items) &&
    typeof data.total === 'number' &&
    data.shippingAddress
  );
};

export const validateResetPasswordEmailData = (data: ResetPasswordEmailData): boolean => {
  return !!(data.name && data.resetLink && data.expirationTime);
};