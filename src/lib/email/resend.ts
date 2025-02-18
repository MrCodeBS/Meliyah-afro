import { Resend } from 'resend';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const RESEND_API_KEY = 're_tfNYfuN3_Ltcf7AUwqzxisXEYN74yj74E';
const FROM_EMAIL = 'booking@meliyahafrohair.ch';
const GOOGLE_MAPS_LINK = 'https://www.google.com/maps/place/Meliyah+afro-shop/@47.5572101,8.891765,17z/data=!3m1!4b1!4m6!3m5!1s0x479a93bb8e5d2bbf:0xfb933de73c24e39f!8m2!3d47.5572101!4d8.8943399!16s%2Fg%2F11rvbtklvv';

if (!RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY');
}

export const resend = new Resend(RESEND_API_KEY);

interface SendBookingConfirmationProps {
  bookingId: string;
  customerName: string;
  customerEmail: string;
  packageName: string;
  date: Date;
  time: string;
  price: number;
}

export async function sendBookingConfirmation({
  bookingId,
  customerName,
  customerEmail,
  packageName,
  date,
  time,
  price
}: SendBookingConfirmationProps) {
  try {
    // Generate calendar event data
    const eventStart = new Date(`${format(date, 'yyyy-MM-dd')}T${time}`);
    const eventEnd = new Date(eventStart.getTime() + 60 * 60 * 1000); // Add 1 hour

    const calendarEvent = {
      start: eventStart.toISOString(),
      end: eventEnd.toISOString(),
      summary: `Termin bei Meliyah afro-shop - ${packageName}`,
      description: `Ihr Termin bei Meliyah afro-shop\n\nPaket: ${packageName}\nUhrzeit: ${time} Uhr\nAdresse: Rheinstrasse 21, 8500 Frauenfeld`,
      location: 'Meliyah afro-shop, Rheinstrasse 21, 8500 Frauenfeld'
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarEvent.summary)}&dates=${eventStart.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${eventEnd.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(calendarEvent.description)}&location=${encodeURIComponent(calendarEvent.location)}`;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: 'Buchungsbestätigung - Meliyah afro-shop',
      html: `
        <!DOCTYPE html>
        <html lang="de">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333; margin-bottom: 24px;">Buchungsbestätigung</h1>
            
            <p style="color: #666; margin-bottom: 16px;">Hallo ${customerName},</p>
            <p style="color: #666; margin-bottom: 24px;">Vielen Dank für Ihre Buchung bei Meliyah afro-shop!</p>
            
            <div style="background-color: #f9f9f9; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
              <h2 style="color: #333; margin-bottom: 16px;">Ihre Buchungsdetails:</h2>
              <p style="margin-bottom: 8px;"><strong>Buchungsnummer:</strong> ${bookingId}</p>
              <p style="margin-bottom: 8px;"><strong>Paket:</strong> ${packageName}</p>
              <p style="margin-bottom: 8px;"><strong>Datum:</strong> ${format(date, 'PPP', { locale: de })}</p>
              <p style="margin-bottom: 8px;"><strong>Uhrzeit:</strong> ${time} Uhr</p>
              <p style="margin-bottom: 8px;"><strong>Preis:</strong> CHF ${price.toFixed(2)}</p>
            </div>

            <a 
              href="${googleCalendarUrl}"
              target="_blank"
              style="display: block; background-color: #4285f4; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; margin-bottom: 24px; text-align: center;"
            >
              Zum Kalender hinzufügen
            </a>
            
            <div style="background-color: #fff3e6; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
              <h3 style="color: #ff8c00; margin-bottom: 16px;">Wichtige Informationen</h3>
              <ul style="color: #666; padding-left: 20px;">
                <li>Bitte erscheinen Sie pünktlich zu Ihrem Termin</li>
                <li>Bei Verhinderung bitten wir Sie, den Termin mindestens 24 Stunden vorher abzusagen</li>
                <li>Die Zahlung erfolgt vor Ort</li>
              </ul>
            </div>

            <div style="margin-bottom: 24px;">
              <h3 style="color: #333; margin-bottom: 16px;">Unser Standort</h3>
              <a 
                href="${GOOGLE_MAPS_LINK}" 
                target="_blank"
                style="display: block; background-color: #ff8c00; color: white; text-decoration: none; padding: 12px 24px; border-radius: 4px; text-align: center;"
              >
                In Google Maps öffnen
              </a>
            </div>
            
            <p style="color: #666; margin-bottom: 24px;">Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
            
            <div style="border-top: 1px solid #eee; padding-top: 24px;">
              <p style="color: #666;">Mit freundlichen Grüssen<br>Ihr Meliyah afro-shop Team</p>
              <p style="color: #999; font-size: 14px;">
                Rheinstrasse 21<br>
                8500 Frauenfeld<br>
                Tel: 0774471179
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send booking confirmation:', error);
    return { success: false, error };
  }
}