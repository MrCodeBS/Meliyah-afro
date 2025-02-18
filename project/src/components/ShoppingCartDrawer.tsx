import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ShoppingCartDrawer() {
  const { state, updateItem, removeItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const handleQuantityChange = async (productId: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      await removeItem(productId);
    } else {
      await updateItem(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    // Redirect to checkout page
    window.location.href = '/checkout';
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          <AnimatePresence>
            {state.items.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                {state.items.length}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 -mx-6 px-6">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh]">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {state.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 p-4 bg-accent rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.productId}</h3>
                      <p className="text-sm text-muted-foreground">
                        CHF {item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.productId, item.quantity, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.productId, item.quantity, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="pt-6 space-y-4">
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>CHF {state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>CHF {state.total.toFixed(2)}</span>
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={handleCheckout}
              disabled={state.items.length === 0}
            >
              Checkout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}