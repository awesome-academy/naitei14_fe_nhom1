import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/src/services/email.service';
import { verifyEmailConnection } from '@/src/lib/nodemailer';
import { EmailTemplateType, MonthlyRevenueReportEmailData, OrderStatusUpdateEmailData } from '@/src/types/email';
import { WelcomeEmailData, OrderConfirmationEmailData, ResetPasswordEmailData } from '@/src/types/email';
import { validateEmails } from '@/src/utils/email.utils';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Middleware to validate Content-Type header
const validateContentType = (request: NextRequest) => {
  const contentType = request.headers.get('Content-Type');
  if (contentType !== 'application/json') {
    throw new Error('Invalid Content-Type. Expected application/json.');
  }
};

type EmailRequestBody = {
  type: EmailTemplateType;
  to: string | string[];
  data: WelcomeEmailData | OrderConfirmationEmailData | ResetPasswordEmailData | OrderStatusUpdateEmailData | MonthlyRevenueReportEmailData;
  subject?: string;
};

const rateLimiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60, // per 60 seconds per IP
});

const authenticateRequest = (request: NextRequest): boolean => {
  const authHeader = request.headers.get('Authorization');
  const validToken = process.env.API_AUTH_TOKEN; // Store this securely
  return authHeader === `Bearer ${validToken}`;
};

export async function POST(request: NextRequest) {
  try {
    validateContentType(request);

    const isConnected = await verifyEmailConnection();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: 'Email service is not available' },
        { status: 503 }
      );
    }

    const body: EmailRequestBody = await request.json();
    const { type, to, data, subject } = body;

    if (!type || !to || !data) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, to, data' },
        { status: 400 }
      );
    }

    const { valid: validEmails, invalid: invalidEmails } = validateEmails(Array.isArray(to) ? to : [to]);

    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { success: false, error: `Invalid email addresses: ${invalidEmails.join(', ')}` },
        { status: 400 }
      );
    }

    // Gửi email theo loại
    let success = false;
    switch (type) {
      case 'welcome':
        success = await emailService.sendWelcomeEmail(to as string, data as WelcomeEmailData);
        break;
      case 'order-confirmation':
        success = await emailService.sendOrderConfirmationEmail(to as string, data as OrderConfirmationEmailData);
        break;
      case 'reset-password':
        success = await emailService.sendResetPasswordEmail(to as string, data as ResetPasswordEmailData);
        break;
      case 'order-status-update':
        success = await emailService.sendOrderStatusUpdateEmail(to as string, data as OrderStatusUpdateEmailData);
        break;
      case 'monthly-revenue-report':
        success = await emailService.sendMonthlyRevenueReportEmail(to as string, data as MonthlyRevenueReportEmailData);
        break;
      default:
        throw new Error('Unsupported email type');
    }

    if (success) {
      return NextResponse.json(
        { success: true, message: 'Email sent successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';

    await rateLimiter.consume(clientIp); // Consume a point for the IP

    if (!authenticateRequest(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { to, subject, html, text } = await request.json();

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { valid: validEmails, invalid: invalidEmails } = validateEmails(Array.isArray(to) ? to : [to]);

    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { success: false, error: `Invalid email addresses: ${invalidEmails.join(', ')}` },
        { status: 400 }
      );
    }

    await emailService.sendEmail({ to, subject, html, text });

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof RateLimiterMemory) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      );
    }

    console.error('Simple email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}