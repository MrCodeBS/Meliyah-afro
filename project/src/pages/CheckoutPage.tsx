import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { klaraApi } from '@/lib/api/klara';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state: cartState, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'twint' | 'paypal'>('card');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'CH',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Create order in KLARA
      const order = await klaraApi.createOrder({
        items: cartState.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        customer: {
          email: formData.email,
          name: formData.name,
          address: {
            street: formData.street,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country
          }
        },
        payment: {
          method: paymentMethod
        }
      });

      // Clear cart and redirect to success page
      clearCart();
      navigate('/checkout/success', { 
        state: { orderId: order.id } 
      });
      
      toast.success('Bestellung erfolgreich aufgegeben');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Fehler bei der Bestellung');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartState.items.length === 0) {
    return (
      <div className="container max-w-lg mx-auto py-12 px-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Ihr Warenkorb ist leer</h2>
              <Button onClick={() => navigate('/products')}>
                Zurück zum Shop
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Bestellübersicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cartState.items.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.productId}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity}x CHF {item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium">
                    CHF {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Zwischensumme</span>
                  <span>CHF {cartState.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Versand</span>
                  <span>Kostenlos</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Gesamtbetrag</span>
                  <span>CHF {cartState.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Form */}
        <Card>
          <CardHeader>
            <CardTitle>Checkout</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="street">Strasse</Label>
                  <Input
                    id="street"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postalCode">PLZ</Label>
                    <Input
                      id="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ort</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Zahlungsmethode</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value: 'card' | 'twint' | 'paypal') => setPaymentMethod(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Kreditkarte</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="twint" id="twint" />
                      <Label htmlFor="twint">TWINT</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <LoadingSpinner className="mr-2" />
                    Wird verarbeitet...
                  </>
                ) : (
                  `Jetzt bezahlen (CHF ${cartState.total.toFixed(2)})`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}