import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const emailTemplates = [
  {
    id: 'welcome',
    name: 'Willkommens-Email',
    subject: 'Willkommen bei Meliyah afro-shop!',
    content: `Liebe Kundin, lieber Kunde,

Herzlich willkommen bei Meliyah afro-shop! Wir freuen uns sehr, Sie bei uns begrüssen zu dürfen.

Als Willkommensgeschenk erhalten Sie 10% Rabatt auf Ihre erste Behandlung. Nutzen Sie dazu einfach den Code WELCOME10 bei Ihrer nächsten Buchung.

Beste Grüsse
Ihr Meliyah afro-shop Team`,
  },
  {
    id: 'birthday',
    name: 'Geburtstags-Email',
    subject: 'Alles Gute zum Geburtstag! 🎉',
    content: `Liebe/r {name},

Herzlichen Glückwunsch zum Geburtstag! 

Als kleines Geschenk erhalten Sie 20% Rabatt auf Ihre nächste Behandlung. Der Gutschein ist 30 Tage gültig.

Beste Grüsse
Ihr Meliyah afro-shop Team`,
  },
  {
    id: 'reminder',
    name: 'Termin-Erinnerung',
    subject: 'Erinnerung: Ihr Termin morgen',
    content: `Liebe Kundin, lieber Kunde,

wir möchten Sie an Ihren morgigen Termin um {time} Uhr erinnern.

Bei Verhinderung bitten wir Sie, den Termin mindestens 24 Stunden vorher abzusagen.

Beste Grüsse
Ihr Meliyah afro-shop Team`,
  },
  {
    id: 'feedback',
    name: 'Feedback-Anfrage',
    subject: 'Wie war Ihr Besuch bei uns?',
    content: `Liebe Kundin, lieber Kunde,

vielen Dank für Ihren Besuch bei uns. Wir würden uns sehr über Ihr Feedback freuen.

Teilen Sie Ihre Erfahrung auf Google und erhalten Sie bei Ihrem nächsten Besuch 10% Rabatt.

Beste Grüsse
Ihr Meliyah afro-shop Team`,
  }
];

export default function MarketingSection() {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleTemplateChange = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setEmailSubject(template.subject);
      setEmailContent(template.content);
    }
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailContent) {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }

    setIsSending(true);
    try {
      // Here you would integrate with your email service provider
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Email-Kampagne erfolgreich gestartet');
      
      // Save template if modified
      if (selectedTemplate && (
        emailSubject !== emailTemplates.find(t => t.id === selectedTemplate)?.subject ||
        emailContent !== emailTemplates.find(t => t.id === selectedTemplate)?.content
      )) {
        // Here you would save the modified template
        toast.success('Template wurde aktualisiert');
      }
    } catch (error) {
      toast.error('Fehler beim Senden der Email-Kampagne');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Marketing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Email-Vorlage</Label>
            <Select
              value={selectedTemplate}
              onValueChange={handleTemplateChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Wählen Sie eine Vorlage" />
              </SelectTrigger>
              <SelectContent>
                {emailTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Betreff</Label>
            <Input
              id="subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder="Email-Betreff eingeben"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Inhalt</Label>
            <Textarea
              id="content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Email-Inhalt eingeben"
              className="min-h-[200px] font-mono"
            />
            <p className="text-sm text-muted-foreground">
              Verfügbare Variablen: {'{name}'}, {'{time}'}, {'{date}'}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTemplate('');
                setEmailSubject('');
                setEmailContent('');
              }}
            >
              Zurücksetzen
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isSending}
            >
              {isSending ? 'Wird gesendet...' : 'Email-Kampagne starten'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marketing-Statistiken</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Email-Öffnungsrate
              </h3>
              <p className="text-2xl font-bold">68%</p>
              <p className="text-sm text-muted-foreground">
                +5% gegenüber letztem Monat
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Klickrate
              </h3>
              <p className="text-2xl font-bold">45%</p>
              <p className="text-sm text-muted-foreground">
                +3% gegenüber letztem Monat
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Conversion Rate
              </h3>
              <p className="text-2xl font-bold">12%</p>
              <p className="text-sm text-muted-foreground">
                +2% gegenüber letztem Monat
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Letzte Kampagnen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: 'Frühlings-Special 2024',
                date: '2024-03-15',
                opens: 245,
                clicks: 89,
                conversions: 28,
              },
              {
                name: 'Valentinstag Aktion',
                date: '2024-02-10',
                opens: 312,
                clicks: 134,
                conversions: 42,
              },
              {
                name: 'Januar Newsletter',
                date: '2024-01-05',
                opens: 289,
                clicks: 98,
                conversions: 31,
              },
            ].map((campaign, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{campaign.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(campaign.date).toLocaleDateString('de-CH')}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {campaign.opens} Öffnungen
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {campaign.clicks} Klicks
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {campaign.conversions} Conversions
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}