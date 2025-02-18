import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';

export function handleError(error: unknown, context: string) {
  console.error(`${context}:`, error);

  if (error instanceof PostgrestError) {
    // Handle specific Supabase errors
    switch (error.code) {
      case '23505': // Unique violation
        toast.error('Ein Eintrag mit diesen Daten existiert bereits');
        break;
      case '23503': // Foreign key violation
        toast.error('Der Eintrag kann nicht gelöscht werden, da er noch verwendet wird');
        break;
      case '42P01': // Undefined table
        toast.error('Datenbankfehler: Tabelle nicht gefunden');
        break;
      case '42703': // Undefined column
        toast.error('Datenbankfehler: Spalte nicht gefunden');
        break;
      case '28000': // Invalid authorization
        toast.error('Keine Berechtigung für diese Operation');
        break;
      default:
        toast.error('Ein Datenbankfehler ist aufgetreten');
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('Ein unerwarteter Fehler ist aufgetreten');
  }

  // Report to error tracking service if needed
  // reportError(error, context);
}