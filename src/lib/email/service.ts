import { Resend } from 'resend';
import { emailTemplates } from './templates/booking';
import { logger } from '../logger';
import { Booking } from '@/types';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

if (!process.env.RESEND_FROM_EMAIL) {
  throw new Error('Missing RESEND_FROM_EMAIL environment variable');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {
  async sendBookingConfirmation(booking: Booking) {
    try {
      if (!booking.user?.email) {
        throw new Error('No customer email provided');
      }

      const template = emailTemplates.confirmation(booking);
      const { data, error } = await resend.emails.send({
        from: `Meliyah afro-shop <${process.env.RESEND_FROM_EMAIL}>`,
        to: booking.user.email,
        subject: template.subject,
        html: template.html
      });

      if (error) throw error;

      logger.info('Confirmation email sent', {
        context: { bookingId: booking.id, messageId: data.id }
      });

      return { success: true, messageId: data.id };
    } catch (error) {
      logger.error('Failed to send confirmation email', {
        context: { 
          bookingId: booking.id,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      return { success: false, error };
    }
  }
};