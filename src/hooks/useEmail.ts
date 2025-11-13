import { useState } from 'react';
import { EmailTemplateType, MonthlyRevenueReportEmailData, OrderConfirmationEmailData, OrderStatusUpdateEmailData, ResetPasswordEmailData, WelcomeEmailData } from '@/src/types/email';

interface EmailHookReturn {
  sendEmail: (type: EmailTemplateType, to: string | string[], data: WelcomeEmailData | OrderConfirmationEmailData | ResetPasswordEmailData | OrderStatusUpdateEmailData | MonthlyRevenueReportEmailData, subject?: string) => Promise<boolean>;
  sendSimpleEmail: (to: string, subject: string, html?: string, text?: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export const useEmail = (): EmailHookReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (
    type: EmailTemplateType,
    to: string | string[],
    data: WelcomeEmailData | OrderConfirmationEmailData | ResetPasswordEmailData | OrderStatusUpdateEmailData | MonthlyRevenueReportEmailData,
    subject?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, to, data, subject }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email');
      }

      return result.success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Email sending error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sendSimpleEmail = async (
    to: string,
    subject: string,
    html?: string,
    text?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, html, text }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Simple email sending error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendEmail,
    sendSimpleEmail,
    loading,
    error,
  };
};

export default useEmail;