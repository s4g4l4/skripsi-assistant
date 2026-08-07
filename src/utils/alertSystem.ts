import nodemailer from 'nodemailer';
import { logger } from './logger.js';

class AlertSystem {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: Boolean(process.env.SMTP_SECURE),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  public async sendCriticalAlert(subject: string, errorDetails: any) {
    logger.error(`[CRITICAL ALERT] ${subject}`, { errorDetails });

    if (!this.transporter || !process.env.ALERT_RECIPIENT_EMAIL) {
      logger.warn('Alert Email Not Sent: SMTP configuration or ALERT_RECIPIENT_EMAIL missing.');
      return;
    }

    try {
      await this.transporter.sendMail({
        from: `"Dukun Skripsi Alert" <${process.env.SMTP_USER}>`,
        to: process.env.ALERT_RECIPIENT_EMAIL,
        subject: `🚨 [CRITICAL ALERT] ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
            <h2 style="color: #dc2626;">🚨 Alert Error Kritis Server</h2>
            <p><strong>Waktu:</strong> ${new Date().toISOString()}</p>
            <p><strong>Pesan:</strong> ${subject}</p>
            <pre style="background: #1e293b; color: #f8fafc; padding: 15px; border-radius: 8px; overflow-x: auto;">
              ${JSON.stringify(errorDetails, null, 2)}
            </pre>
          </div>
        `,
      });
      logger.info('Alert email sent successfully to ' + process.env.ALERT_RECIPIENT_EMAIL);
    } catch (err: any) {
      logger.error('Failed to send alert email', { error: err.message });
    }
  }
}

export const alertSystem = new AlertSystem();
