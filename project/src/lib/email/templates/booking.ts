import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Booking } from '@/types';

const GOOGLE_MAPS_LINK = 'https://maps.google.com/?q=Meliyah+afro-shop+Rheinstrasse+21+8500+Frauenfeld';

export const emailTemplates = {
  confirmation: (booking: Booking) => ({
    subject: 'Buchungsbestätigung - Meliyah afro-shop',
    html: `
      <!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .important { background: #fff3e6; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          .button { display: inline-block; padding: 12px 24px; background: #ff8c00; color: white; text-decoration: none; border-radius: 4px; }
          .location { display: flex; align-items: center; margin-top: 10px; }
          .location a { color: #ff8c00; text-decoration: none; }
          .location a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Buchungsbestätigung</h1>
          </div>

          <p>Hallo ${booking.user?.name},</p>
          <p>Vielen Dank für Ihre Buchung bei Meliyah afro-shop!</p>

          <div class="details">
            <h2>Ihre Buchungsdetails:</h2>
            <p><strong>Buchungsnummer:</strong> ${booking.id}</p>
            <p><strong>Paket:</strong> ${booking.package?.name}</p>
            <p><strong>Datum:</strong> ${format(new Date(booking.date), 'PPP', { locale: de })}</p>
            <p><strong>Uhrzeit:</strong> ${booking.time} Uhr</p>
            <p><strong>Preis:</strong> CHF ${booking.total_price.toFixed(2)}</p>
          </div>

          <div class="important">
            <h3 style="color: #ff8c00;">Wichtige Informationen</h3>
            <ul>
              <li>Bitte erscheinen Sie pünktlich zu Ihrem Termin</li>
              <li>Bei Verhinderung bitten wir Sie, den Termin mindestens 24 Stunden vorher abzusagen</li>
              <li>Die Zahlung erfolgt vor Ort</li>
            </ul>
          </div>

          <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Termin bei Meliyah afro-shop - ${booking.package?.name}`)}&dates=${format(new Date(booking.date), 'yyyyMMdd')}T${booking.time.replace(':', '')}00/${format(new Date(booking.date), 'yyyyMMdd')}T${booking.time.replace(':', '')}00&details=${encodeURIComponent(`Ihr Termin bei Meliyah afro-shop\n\nPaket: ${booking.package?.name}\nUhrzeit: ${booking.time} Uhr\nAdresse: Rheinstrasse 21, 8500 Frauenfeld`)}&location=${encodeURIComponent('Meliyah afro-shop, Rheinstrasse 21, 8500 Frauenfeld')}" class="button" target="_blank">
            Zum Kalender hinzufügen
          </a>

          <div class="footer">
            <p>Mit freundlichen Grüssen<br>Ihr Meliyah afro-shop Team</p>
            <div style="font-size: 14px; color: #666;">
              <p style="margin-bottom: 5px;">
                <a href="${GOOGLE_MAPS_LINK}" style="color: #ff8c00; text-decoration: none;" target="_blank">
                  📍 Rheinstrasse 21, 8500 Frauenfeld
                </a>
              </p>
              <p>Tel: 0774471179</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  reminder: (booking: Booking) => ({
    subject: 'Erinnerung: Ihr Termin morgen bei Meliyah afro-shop',
    html: `
      <!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .preparation { background: #e6f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          .button { display: inline-block; padding: 12px 24px; background: #ff8c00; color: white; text-decoration: none; border-radius: 4px; }
          .location { display: flex; align-items: center; margin-top: 10px; }
          .location a { color: #ff8c00; text-decoration: none; }
          .location a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Terminerinnerung</h1>
          </div>

          <p>Hallo ${booking.user?.name},</p>
          <p>wir möchten Sie an Ihren morgigen Termin erinnern:</p>

          <div class="details">
            <h2>Termindetails:</h2>
            <p><strong>Paket:</strong> ${booking.package?.name}</p>
            <p><strong>Datum:</strong> ${format(new Date(booking.date), 'PPP', { locale: de })}</p>
            <p><strong>Uhrzeit:</strong> ${booking.time} Uhr</p>
            <p><strong>Adresse:</strong> <a href="${GOOGLE_MAPS_LINK}" style="color: #ff8c00;" target="_blank">Rheinstrasse 21, 8500 Frauenfeld</a></p>
          </div>

          <div class="preparation">
            <h3>Vorbereitung für Ihren Termin:</h3>
            <ul>
              <li>Bitte erscheinen Sie pünktlich</li>
              <li>Bringen Sie ein Foto mit, falls Sie einen bestimmten Style wünschen</li>
              <li>Informieren Sie uns über eventuelle Allergien oder Empfindlichkeiten</li>
            </ul>
          </div>

          <p>
            Falls Sie den Termin nicht wahrnehmen können, kontaktieren Sie uns bitte umgehend unter:<br>
            Tel: 0774471179<br>
            Email: booking@meliyahafrohair.ch
          </p>

          <div class="footer">
            <p>Mit freundlichen Grüssen<br>Ihr Meliyah afro-shop Team</p>
            <div style="font-size: 14px; color: #666;">
              <p style="margin-bottom: 5px;">
                <a href="${GOOGLE_MAPS_LINK}" style="color: #ff8c00; text-decoration: none;" target="_blank">
                  📍 Rheinstrasse 21, 8500 Frauenfeld
                </a>
              </p>
              <p>Tel: 0774471179</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  })
};