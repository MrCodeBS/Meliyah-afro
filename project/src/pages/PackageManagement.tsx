import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Package, Service } from '@/types';
import { packages as initialPackages, services } from '@/data/mockData';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Package as PackageIcon } from 'lucide-react';

export default function PackageManagement() {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const defaultPackage: Omit<Package, 'id'> = {
    name: '',
    description: '',
    services: [],
    price: 0,
    discountPercentage: 0
  };

  const [formData, setFormData] = useState<Omit<Package, 'id'>>(defaultPackage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPackage) {
      setPackages(packages.map(p => 
        p.id === editingPackage.id 
          ? { ...formData, id: editingPackage.id }
          : p
      ));
      toast.success('Paket erfolgreich aktualisiert');
    } else {
      const newPackage: Package = {
        ...formData,
        id: crypto.randomUUID(),
      };
      setPackages([...packages, newPackage]);
      toast.success('Paket erfolgreich hinzugefügt');
    }
    
    handleClose();
  };

  const handleClose = () => {
    setEditingPackage(null);
    setFormData(defaultPackage);
    setShowDialog(false);
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData(pkg);
    setShowDialog(true);
  };

  const handleDelete = (packageId: string) => {
    if (confirm('Sind Sie sicher, dass Sie dieses Paket löschen möchten?')) {
      setPackages(packages.filter(p => p.id !== packageId));
      toast.success('Paket erfolgreich gelöscht');
    }
  };

  const calculateTotalPrice = (selectedServices: Service[]) => {
    return selectedServices.reduce((sum, service) => sum + service.price, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paket Management</h1>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Paket hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? 'Paket bearbeiten' : 'Neues Paket'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Preis (CHF) *</Label>
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
                  <Label htmlFor="description">Beschreibung *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="h-24"
                    required
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label>Services</Label>
                  <div className="space-y-2">
                    {services.map(service => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Switch
                          checked={formData.services.some(s => s.id === service.id)}
                          onCheckedChange={(checked) => {
                            const updatedServices = checked
                              ? [...formData.services, service]
                              : formData.services.filter(s => s.id !== service.id);
                            setFormData({ ...formData, services: updatedServices });
                          }}
                        />
                        <span>{service.name} - CHF {service.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPercentage">Rabatt (%)</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) => setFormData({ ...formData, discountPercentage: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gesamtpreis</Label>
                  <p className="text-2xl font-bold">
                    CHF {calculateTotalPrice(formData.services).toFixed(2)}
                  </p>
                  {formData.discountPercentage > 0 && (
                    <p className="text-sm text-primary">
                      Mit {formData.discountPercentage}% Rabatt: CHF {(calculateTotalPrice(formData.services) * (1 - formData.discountPercentage / 100)).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  Abbrechen
                </Button>
                <Button type="submit">
                  {editingPackage ? 'Aktualisieren' : 'Hinzufügen'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pakete</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Preis</TableHead>
                  <TableHead>Rabatt</TableHead>
                  <TableHead className="text-right">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{pkg.name}</TableCell>
                    <TableCell>{pkg.services.length} Services</TableCell>
                    <TableCell>CHF {pkg.price.toFixed(2)}</TableCell>
                    <TableCell>{pkg.discountPercentage}%</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(pkg)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(pkg.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}