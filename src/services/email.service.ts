import { getTransporter } from '@/src/lib/nodemailer';
import { EmailOptions, EmailTemplateType, MonthlyRevenueReportEmailData, OrderConfirmationEmailData, OrderStatusUpdateEmailData, ResetPasswordEmailData, WelcomeEmailData } from '@/src/types/email';
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
      console.error('Error sending templated email:', error);
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

    const info = await getTransporter().sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
  }

  async sendWelcomeEmail(to: string, data: WelcomeEmailData) {
    return this.sendTemplatedEmail('welcome', to, data);
  }

  async sendOrderConfirmationEmail(to: string, data: OrderConfirmationEmailData) {
    return this.sendTemplatedEmail('order-confirmation', to, data);
  }

  async sendResetPasswordEmail(to: string, data: ResetPasswordEmailData) {
    return this.sendTemplatedEmail('reset-password', to, data);
  }

  async sendOrderStatusUpdateEmail(to: string, data: OrderStatusUpdateEmailData) {
    return this.sendTemplatedEmail('order-status-update', to, data);
  }

  async sendMonthlyRevenueReportEmail(to: string, data: MonthlyRevenueReportEmailData) {
    return this.sendTemplatedEmail('monthly-revenue-report', to, data);
  }
}

export const emailService = new EmailService();
export default emailService;