import { addDays } from 'date-fns';
import { supabase } from '../supabase/config';
import { emailService } from './service';
import { logger } from '../logger';
import { monitoring } from '../monitoring';

const SCHEDULER_CONFIG = {
  BATCH_SIZE: 5,
  RATE_LIMIT_DELAY: 1000,
  MAX_RETRIES: 3
};

export async function scheduleReminderEmails() {
  return monitoring.trackApiCall('email.scheduleReminders', async () => {
    try {
      // Get bookings for tomorrow
      const tomorrow = addDays(new Date(), 1);
      tomorrow.setHours(0, 0, 0, 0);

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:users(name, email, phone),
          package:packages(name, price)
        `)
        .eq('date', tomorrow.toISOString().split('T')[0])
        .eq('status', 'CONFIRMED')
        .eq('reminder_email', true)
        .is('reminder_email_sent', null);

      if (error) throw error;

      logger.info('Found bookings for reminders', {
        context: { count: bookings?.length || 0 }
      });

      // Send reminders in batches to avoid rate limits
      const results = [];
      for (let i = 0; i < (bookings?.length || 0); i += SCHEDULER_CONFIG.BATCH_SIZE) {
        const batch = bookings?.slice(i, i + SCHEDULER_CONFIG.BATCH_SIZE) || [];
        
        const batchResults = await Promise.allSettled(
          batch.map(async (booking) => {
            try {
              if (booking.user?.email) {
                return await emailService.sendBookingReminder(booking);
              }
            } catch (error) {
              logger.error('Failed to send reminder email', {
                context: { 
                  bookingId: booking.id,
                  error: error instanceof Error ? error.message : 'Unknown error'
                }
              });
              throw error;
            }
          })
        );

        results.push(...batchResults);

        // Rate limiting pause between batches
        if (i + SCHEDULER_CONFIG.BATCH_SIZE < (bookings?.length || 0)) {
          await new Promise(resolve => setTimeout(resolve, SCHEDULER_CONFIG.RATE_LIMIT_DELAY));
        }
      }

      // Log results
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      logger.info('Reminder emails scheduled', {
        context: { 
          total: bookings?.length || 0,
          successful,
          failed
        }
      });

      return { 
        success: true, 
        total: bookings?.length || 0,
        successful,
        failed
      };
    } catch (error) {
      logger.error('Failed to schedule reminder emails', {
        context: { 
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      return { success: false, error };
    }
  });
}