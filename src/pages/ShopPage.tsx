import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { products } from '@/data/mockData';
import { useBooking } from '@/contexts/BookingContext';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ShopPage() {
  const { state, dispatch } = useBooking();

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      dispatch({ type: 'ADD_PRODUCT', payload: product });
      toast.success('Produkt zum Warenkorb hinzugefügt');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Shop</h1>
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span>{state.selectedProducts.length} Produkte</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <Card 
            key={product.id} 
            className={cn(
              "flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl",
              "animate-in fade-in-50 slide-in-from-bottom-6",
              "data-[state=open]:animate-in",
              "data-[state=closed]:animate-out",
              { "delay-200": index === 1, "delay-400": index === 2 }
            )}
          >
            <div className="aspect-square overflow-hidden rounded-t-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <CardDescription>{product.brand}</CardDescription>
                </div>
                <span className="text-lg font-bold">CHF {product.price.toFixed(2)}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground">{product.description}</p>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {product.category}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full transform transition-all hover:shadow-lg hover:translate-y-[-2px]"
                onClick={() => handleAddToCart(product.id)}
                disabled={!product.inStock}
              >
                {product.inStock ? 'In den Warenkorb' : 'Ausverkauft'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}