import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/src/services/email.service';
import { verifyEmailConnection, isEmailConfigured } from '@/src/lib/nodemailer';
import { EmailTemplateType } from '@/src/types/email';

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
  data: any;
  subject?: string;
};

export async function POST(request: NextRequest) {
  try {
    validateContentType(request);

    const isConnected = await verifyEmailConnection();
    if (!isConnected) {
      return NextResponse.json(
        { success: false, error: 'Email service is not available' },
      );
    }

    const body: EmailRequestBody = await request.json();
    const { type, to, data, subject } = body;

    if (!type || !to || !data) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, to, data' },
        { status: 400, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate', Pragma: 'no-cache', Expires: '0' } }
      );
    }

    // Gửi email theo loại
    let success = false;
    switch (type) {
      case 'welcome':
        success = await emailService.sendWelcomeEmail(to as string, data);
        break;
      case 'order-confirmation':
        success = await emailService.sendOrderConfirmationEmail(to as string, data);
        break;
      case 'reset-password':
        success = await emailService.sendResetPasswordEmail(to as string, data);
        break;
      case 'order-status-update':
        success = await emailService.sendOrderStatusUpdateEmail(to as string, data);
        break;
      case 'monthly-revenue-report':
        success = await emailService.sendMonthlyRevenueReportEmail(to as string, data);
        break;
      default:
        success = await emailService.sendTemplatedEmail(type, to, data, { subject });
    }

    if (success) {
      return NextResponse.json(
        { success: true, message: 'Email sent successfully' },
      )
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
      );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { to, subject, html, text } = await request.json();

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
      );
    }

    await emailService.sendEmail({ to, subject, html, text });

    return NextResponse.json(
      { success: true, message: 'Email sent successfully' },
    );
  } catch (error) {
    console.error('Simple email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
    );
  }
}