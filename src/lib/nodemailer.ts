import nodemailer from 'nodemailer';
import { isEmailConfigured } from '../utils/email.utils';

let transporter: nodemailer.Transporter | null = null;

export const getTransporter = (): nodemailer.Transporter => {
  if (!transporter) {
    if (!isEmailConfigured()) {
      throw new Error('Email is not configured. Please set SMTP environment variables.');
    }

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  return transporter;
};

export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    if (!isEmailConfigured()) {
      console.warn('Email not configured. Please set SMTP environment variables.');
      return false;
    }

    await getTransporter().verify();
    console.log('Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('Email server connection failed:', error);
    return false;
  }
};