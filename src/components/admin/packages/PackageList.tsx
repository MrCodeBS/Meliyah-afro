```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Package } from '@/types';
import { packagesApi } from '@/lib/supabase/api/packages';
import { toast } from 'sonner';
import PackageDialog from './PackageDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function PackageList() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<Package | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await packagesApi.getAll();
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (pkg: Partial<Package>) => {
    try {
      if (selectedPackage) {
        await packagesApi.update(selectedPackage.id, pkg);
        toast.success(t('packageUpdated'));
      } else {
        await packagesApi.create(pkg as Omit<Package, 'id'>);
        toast.success(t('packageCreated'));
      }
      fetchPackages();
      setShowDialog(false);
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  const handleDelete = async () => {
    if (!packageToDelete) return;

    try {
      await packagesApi.delete(packageToDelete.id);
      toast.success(t('packageDeleted'));
      fetchPackages();
      setPackageToDelete(null);
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('packages')}</CardTitle>
          <Button onClick={() => {
            setSelectedPackage(null);
            setShowDialog(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            {t('addPackage')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="relative">
                <CardContent className="p-6">
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setShowDialog(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPackageToDelete(pkg)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                  <p className="text-muted-foreground mb-4">{pkg.description}</p>
                  
                  <div className="space-y-4">
                    <div className="text-2xl font-bold">
                      {formatCurrency(pkg.price)}
                      {pkg.discountPercentage > 0 && (
                        <span className="ml-2 text-sm text-primary">
                          {pkg.discountPercentage}% {t('discount')}
                        </span>
                      )}
                    </div>

                    {pkg.services?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">{t('includedServices')}</h4>
                        <ul className="space-y-2">
                          {pkg.services.map((service) => (
                            <li key={service.id} className="flex justify-between">
                              <span>{service.name}</span>
                              <span className="text-muted-foreground">
                                {formatCurrency(service.price)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <PackageDialog
        package={selectedPackage}
        open={showDialog}
        onOpenChange={setShowDialog}
        onSave={handleSave}
      />

      <AlertDialog open={!!packageToDelete} onOpenChange={() => setPackageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deletePackage')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deletePackageConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
```