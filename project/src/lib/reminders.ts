import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Reminder {
  type: 'email' | 'sms';
  date: Date;
  recipient: string;
  booking: any;
}

export async function scheduleReminder(reminder: Reminder) {
  const formattedDate = format(reminder.date, 'PPP', { locale: de });
  const formattedTime = reminder.booking.time;

  const templates = {
    email: {
      subject: 'Erinnerung: Ihr Termin morgen bei Meliyah afro-shop',
      body: `Liebe Kundin, lieber Kunde,

wir möchten Sie an Ihren morgigen Termin um ${formattedTime} Uhr erinnern.

Details:
- Datum: ${formattedDate}
- Uhrzeit: ${formattedTime}
- Paket: ${reminder.booking.packageName}

Bei Verhinderung bitten wir Sie, den Termin mindestens 24 Stunden vorher abzusagen.

Beste Grüsse
Ihr Meliyah afro-shop Team`
    },
    sms: {
      body: `Meliyah afro-shop: Erinnerung an Ihren Termin morgen um ${formattedTime} Uhr. Bei Verhinderung bitte 24h vorher absagen.`
    }
  };

  try {
    // In a real application, this would make an API call to your notification service
    console.log(`Scheduled ${reminder.type} reminder for ${reminder.date}`);
    console.log(`Recipient: ${reminder.recipient}`);
    console.log(`Template: ${JSON.stringify(templates[reminder.type], null, 2)}`);
    
    return true;
  } catch (error) {
    console.error('Failed to schedule reminder:', error);
    return false;
  }
}