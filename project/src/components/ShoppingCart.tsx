import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart as CartIcon, X, Package, Clock, Minus, Plus } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
  id: string;
  quantity: number;
}

export default function ShoppingCart() {
  const { state, dispatch } = useBooking();
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Convert products array to cart items with quantities
    const items = state.selectedProducts.reduce((acc: CartItem[], product) => {
      const existingItem = acc.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        acc.push({ id: product.id, quantity: 1 });
      }
      return acc;
    }, []);
    setCartItems(items);
  }, [state.selectedProducts]);

  const handleQuantityChange = (productId: string, change: number) => {
    if (change < 0) {
      dispatch({ type: 'REMOVE_PRODUCT', payload: productId });
      toast.success('Produkt aus dem Warenkorb entfernt');
    } else {
      const product = state.selectedProducts.find(p => p.id === productId);
      if (product) {
        dispatch({ type: 'ADD_PRODUCT', payload: product });
        toast.success('Produkt zum Warenkorb hinzugefügt');
      }
    }
  };

  const calculateSubtotal = () => {
    return state.selectedProducts.reduce((sum, product) => sum + product.price, 0);
  };

  const TAX_RATE = 0.077; // 7.7% Swiss VAT
  const subtotal = calculateSubtotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <CartIcon className="h-4 w-4 mr-2" />
          <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} Produkte</span>
          <AnimatePresence>
            {cartItems.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Warenkorb</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-8rem)]">
          <ScrollArea className="flex-1 -mx-6 px-6">
            {state.selectedDate && state.selectedTime && (
              <div className="mb-6 p-4 bg-accent rounded-lg space-y-2">
                <h3 className="font-medium">Termin Details</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>{state.selectedPackage?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(state.selectedDate, 'PPP', { locale: de })} um {state.selectedTime} Uhr
                    </span>
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence>
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-muted-foreground py-8"
                >
                  Ihr Warenkorb ist leer
                </motion.div>
              ) : (
                <motion.div layout className="space-y-4">
                  {cartItems.map((item) => {
                    const product = state.selectedProducts.find(p => p.id === item.id);
                    if (!product) return null;

                    return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-4 p-4 bg-accent rounded-lg"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">{product.brand}</p>
                          <p className="font-medium">CHF {(product.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>

          {cartItems.length > 0 && (
            <div className="pt-6 space-y-4">
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Zwischensumme</span>
                  <span>CHF {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">MwSt. (7.7%)</span>
                  <span>CHF {tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Gesamtbetrag</span>
                  <span>CHF {total.toFixed(2)}</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to checkout or show checkout modal
                }}
              >
                Zur Kasse
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}