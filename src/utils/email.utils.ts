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
  if (!isReAuthenticated('generateResetPasswordLink')) {
    throw new Error('Re-authentication required for sensitive action: generateResetPasswordLink.');
  }
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
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp.slice(-8)}-${random}`;
};

export const isEmailConfigured = (): boolean => {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
};

export const validateWelcomeEmailData = (data: any): boolean => {
  return !!(data.name && data.email);
};

export const validateOrderEmailData = (data: any): boolean => {
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

export const validateResetPasswordEmailData = (data: any): boolean => {
  if (!isReAuthenticated('validateResetPasswordEmailData')) {
    throw new Error('Re-authentication required for sensitive action: validateResetPasswordEmailData.');
  }
  return !!(data.name && data.resetLink && data.expirationTime);
};

const isReAuthenticated = (action: string): boolean => {
  // Placeholder for actual re-authentication logic
  console.log(`Checking re-authentication for action: ${action}`);
  return true; // Replace with real authentication check
};