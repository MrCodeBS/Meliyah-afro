```typescript
'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from '@/hooks/useTranslation';
import { Package, Service } from '@/types';
import { servicesApi } from '@/lib/supabase/api/services';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface PackageDialogProps {
  package: Package | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (pkg: Partial<Package>) => void;
}

export default function PackageDialog({
  package: initialPackage,
  open,
  onOpenChange,
  onSave
}: PackageDialogProps) {
  const [formData, setFormData] = useState<Partial<Package>>({
    name: '',
    description: '',
    price: 0,
    discountPercentage: 0,
    services: []
  });
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      fetchServices();
      if (initialPackage) {
        setFormData(initialPackage);
      } else {
        setFormData({
          name: '',
          description: '',
          price: 0,
          discountPercentage: 0,
          services: []
        });
      }
    }
  }, [open, initialPackage]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await servicesApi.getAll();
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleService = (service: Service) => {
    setFormData(prev => {
      const services = prev.services || [];
      const exists = services.some(s => s.id === service.id);
      
      if (exists) {
        return {
          ...prev,
          services: services.filter(s => s.id !== service.id)
        };
      } else {
        return {
          ...prev,
          services: [...services, service]
        };
      }
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialPackage ? t('editPackage') : t('addPackage')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('name')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">{t('price')} (CHF) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">{t('description')} *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="h-24"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPercentage">{t('discount')} (%)</Label>
              <Input
                id="discountPercentage"
                type="number"
                min="0"
                max="100"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>{t('services')}</Label>
            <div className="grid grid-cols-2 gap-4">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.duration} min - {service.price} CHF
                    </p>
                  </div>
                  <Switch
                    checked={formData.services?.some(s => s.id === service.id)}
                    onCheckedChange={() => toggleService(service)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('cancel')}
            </Button>
            <Button type="submit">
              {initialPackage ? t('save') : t('create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```