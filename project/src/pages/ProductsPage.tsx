import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Search, ShoppingCart, Package } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { klaraApi } from '@/lib/api/klara';
import { useCart } from '@/contexts/CartContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import ShoppingCartDrawer from '@/components/ShoppingCartDrawer';
import { toast } from 'sonner';

const categories = [
  'Kosmetik',
  'Haare extensions',
  'Lebensmittel',
  'Diverses',
  'Coiffure',
  'Früchte Gemüse'
];

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Fetch products from KLARA API
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: klaraApi.getProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { addItem } = useCart();

  const filteredProducts = products
    ?.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory && product.isActive;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'stock':
          return b.stock - a.stock;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleAddToCart = async (product) => {
    try {
      await addItem(product, 1);
      toast.success('Produkt zum Warenkorb hinzugefügt');
    } catch (error) {
      toast.error('Fehler beim Hinzufügen zum Warenkorb');
      console.error('Failed to add to cart:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-destructive/10 text-destructive rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Fehler beim Laden der Produkte</h2>
          <p>{error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Unsere Produkte
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Produkte suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-[200px]"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Kategorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Kategorien</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sortieren nach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-asc">Preis: Aufsteigend</SelectItem>
                  <SelectItem value="price-desc">Preis: Absteigend</SelectItem>
                  <SelectItem value="stock">Lagerbestand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ShoppingCartDrawer />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts?.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="flex flex-col h-full">
                {product.imageUrl && (
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">Art. Nr: {product.sku}</p>
                    </div>
                    <span className="text-lg font-bold">
                      CHF {product.price.toFixed(2)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">{product.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      product.stock > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? `${product.stock} auf Lager` : 'Ausverkauft'}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-medium">
                      {product.category}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.stock > 0 ? 'In den Warenkorb' : 'Ausverkauft'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}