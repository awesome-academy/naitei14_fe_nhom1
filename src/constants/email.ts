export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  ORDER_CONFIRMATION: 'order-confirmation',
  RESET_PASSWORD: 'reset-password',
  ORDER_STATUS_UPDATE: 'order-status-update',
  MONTHLY_REVENUE_REPORT: 'monthly-revenue-report',
} as const;

export const EMAIL_SUBJECTS = {
  WELCOME: 'Chào mừng bạn đến với DrinkShop! 🍹',
  ORDER_CONFIRMATION: 'Xác nhận đơn hàng - DrinkShop',
  RESET_PASSWORD: 'Đặt lại mật khẩu - DrinkShop',
  ORDER_STATUS_UPDATE: 'Cập nhật trạng thái đơn hàng - DrinkShop',
  MONTHLY_REVENUE_REPORT: 'Báo cáo doanh thu hàng tháng - DrinkShop',
} as const;

export const SMTP_PROVIDERS = {
  GMAIL: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
  },
  OUTLOOK: {
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
  },
  YAHOO: {
    host: 'smtp.mail.yahoo.com',
    port: 587,
    secure: false,
  },
  SENDGRID: {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
  },
} as const;

export const EMAIL_LIMITS = {
  MAX_RECIPIENTS: 50,
  MAX_SUBJECT_LENGTH: 200,
  MAX_ATTACHMENT_SIZE: 25 * 1024 * 1024, // 25MB
  RATE_LIMIT_PER_MINUTE: 10,
} as const;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EMAIL_ERRORS = {
  INVALID_EMAIL: 'Email không hợp lệ',
  MISSING_TEMPLATE: 'Thiếu template email',
  MISSING_DATA: 'Thiếu dữ liệu email',
  SEND_FAILED: 'Gửi email thất bại',
  CONNECTION_FAILED: 'Kết nối email server thất bại',
  RATE_LIMIT_EXCEEDED: 'Đã vượt quá giới hạn gửi email',
} as const;

export const DEFAULT_EMAIL_CONFIG = {
  FROM_NAME: 'DrinkShop',
  REPLY_TO: 'noreply@drinkshop.com',
  CHARSET: 'UTF-8',
  ENCODING: 'base64',
} as const;