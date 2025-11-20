import { transporter } from '@/src/lib/nodemailer';
import { EmailOptions, EmailTemplateType } from '@/src/types/email';
import { getEmailTemplate } from '@/src/utils/email-templates';

class EmailService {
  async sendTemplatedEmail<T>(
    templateType: EmailTemplateType,
    to: string | string[],
    data: T,
    options?: Partial<EmailOptions>
  ): Promise<boolean> {
    try {
      const template = await getEmailTemplate(templateType, data);
      
      const mailOptions: EmailOptions = {
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
        ...options,
      };

      await this.sendEmail(mailOptions);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  async sendEmail(options: EmailOptions): Promise<void> {
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'DrinkShop'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      attachments: options.attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
  }

  async sendWelcomeEmail(to: string, data: { name: string; email: string; verificationLink?: string }) {
    return this.sendTemplatedEmail('welcome', to, data);
  }

  async sendOrderConfirmationEmail(to: string, data: any) {
    return this.sendTemplatedEmail('order-confirmation', to, data);
  }

  async sendResetPasswordEmail(to: string, data: { name: string; resetLink: string; expirationTime: string }) {
    if (!this.isReAuthenticated('sendResetPasswordEmail')) {
      throw new Error('Re-authentication required for sensitive action: sendResetPasswordEmail.');
    }
    return this.sendTemplatedEmail('reset-password', to, data);
  }

  async sendOrderStatusUpdateEmail(to: string, data: { orderNumber: string; customerName: string; status: 'confirmed' | 'rejected'; reason?: string; }) {
    if (!this.isReAuthenticated('sendOrderStatusUpdateEmail')) {
      throw new Error('Re-authentication required for sensitive action: sendOrderStatusUpdateEmail.');
    }
    return this.sendTemplatedEmail('order-status-update', to, data);
  }

  async sendMonthlyRevenueReportEmail(to: string, data: { month: string; totalRevenue: number; topProducts: { name: string; revenue: number; }[]; }) {
    return this.sendTemplatedEmail('monthly-revenue-report', to, data);
  }

  private isReAuthenticated(action: string): boolean {
    console.log(`Checking re-authentication for action: ${action}`);
    return true;
  }
}

export const emailService = new EmailService();
export default emailService;