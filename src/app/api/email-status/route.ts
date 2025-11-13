import { NextResponse } from 'next/server';
import { verifyEmailConnection } from '@/src/lib/nodemailer';
import { isEmailConfigured } from '@/src/utils/email.utils';

export async function GET() {
  try {
    const configured = isEmailConfigured();
    
    if (!configured) {
      return NextResponse.json({
        success: true,
        configured: false,
        connected: false,
        message: 'Email service not configured. Please set SMTP environment variables in .env.local',
        config: {
          SMTP_HOST: process.env.SMTP_HOST,
          SMTP_PORT: process.env.SMTP_PORT,
          SMTP_USER: process.env.SMTP_USER,
        },
        timestamp: new Date().toISOString()
      });
    }

    const isConnected = await verifyEmailConnection();
    
    return NextResponse.json({
      success: true,
      configured: true,
      connected: isConnected,
      message: isConnected 
        ? 'Email service is connected and ready to send emails.' 
        : 'Email service is configured but not connected. Please check SMTP settings.',
      config: {
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Email status check error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        configured: isEmailConfigured(),
        connected: false,
        error: 'Unable to check email service status',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}