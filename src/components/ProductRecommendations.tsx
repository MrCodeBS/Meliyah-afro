import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { products } from '@/data/mockData';
import { useBooking } from '@/contexts/BookingContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';

export default function ProductRecommendations() {
  const { state, dispatch } = useBooking();

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      dispatch({ type: 'ADD_PRODUCT', payload: product });
      toast.success('Produkt zum Warenkorb hinzugefügt');
    }
  };

  const isInCart = (productId: string) => {
    return state.selectedProducts.some(p => p.id === productId);
  };

  // Show only 3 recommended products
  const recommendedProducts = products.slice(0, 3);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Empfohlene Produkte für Ihre Behandlung</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader className="p-0">
                <div className="aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <CardTitle className="text-base mb-2">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                <div className="space-y-2">
                  <p className="font-bold">CHF {product.price.toFixed(2)}</p>
                  <p className="text-sm">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {product.category}
                    </span>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full"
                  variant={isInCart(product.id) ? "secondary" : "default"}
                  onClick={() => handleAddToCart(product.id)}
                  disabled={!product.inStock}
                >
                  {isInCart(product.id) ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Im Warenkorb
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      In den Warenkorb
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}