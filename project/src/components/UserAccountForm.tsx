import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

interface UserFormData {
  name: string;
  email: string;
  phone: string;
}

export default function UserAccountForm() {
  const { state, dispatch } = useUser();
  const [formData, setFormData] = useState<UserFormData>({
    name: state.currentUser?.name || '',
    email: state.currentUser?.email || '',
    phone: state.currentUser?.phone || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real application, you would make an API call here
    dispatch({
      type: 'LOGIN',
      payload: {
        id: Date.now().toString(), // In a real app, this would come from the backend
        ...formData,
      },
    });

    toast.success('Konto erfolgreich erstellt!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kundenkonto erstellen</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Konto erstellen
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}