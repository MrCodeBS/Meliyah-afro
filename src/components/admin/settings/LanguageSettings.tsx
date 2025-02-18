'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

export default function LanguageSettings() {
  const { t, language, setLanguage } = useTranslation();

  const handleLanguageChange = (newLang: 'de' | 'en' | 'fr') => {
    setLanguage(newLang);
    toast.success(`${t('language')} ${t(newLang === 'de' ? 'german' : newLang === 'en' ? 'english' : 'french')}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('language')}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={language}
          onValueChange={(value: 'de' | 'en' | 'fr') => handleLanguageChange(value)}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="de" id="de" />
            <Label htmlFor="de">{t('german')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="en" id="en" />
            <Label htmlFor="en">{t('english')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fr" id="fr" />
            <Label htmlFor="fr">{t('french')}</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}