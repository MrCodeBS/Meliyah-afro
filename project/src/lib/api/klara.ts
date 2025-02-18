import { z } from 'zod';

// KLARA API Configuration
const KLARA_API_KEY = process.env.NEXT_PUBLIC_KLARA_API_KEY;
const KLARA_API_URL = process.env.NEXT_PUBLIC_KLARA_API_URL;

// Product schema matching KLARA's data structure
const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional().default(''),
  price: z.number(),
  stock: z.number(),
  sku: z.string(),
  category: z.string(),
  brand: z.string().optional(),
  imageUrl: z.string().optional(),
  barcode: z.string().optional(),
  isActive: z.boolean().default(true),
  attributes: z.object({
    weight: z.number().optional(),
    weightUnit: z.string().optional(),
    dimensions: z.object({
      width: z.number().optional(),
      height: z.number().optional(),
      depth: z.number().optional(),
      unit: z.string().optional(),
    }).optional(),
  }).optional(),
});

export type KlaraProduct = z.infer<typeof productSchema>;

export const klaraApi = {
  async getProducts() {
    try {
      if (!KLARA_API_KEY) {
        throw new Error('KLARA_API_KEY is not configured');
      }

      const response = await fetch(`${KLARA_API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${KLARA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      return z.array(productSchema).parse(data);
    } catch (error) {
      console.error('KLARA API Error:', error);
      throw error;
    }
  },

  async getProduct(id: string) {
    try {
      if (!KLARA_API_KEY) {
        throw new Error('KLARA_API_KEY is not configured');
      }

      const response = await fetch(`${KLARA_API_URL}/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${KLARA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }

      const data = await response.json();
      return productSchema.parse(data);
    } catch (error) {
      console.error('KLARA API Error:', error);
      throw error;
    }
  },

  async updateStock(productId: string, quantity: number) {
    try {
      if (!KLARA_API_KEY) {
        throw new Error('KLARA_API_KEY is not configured');
      }

      const response = await fetch(`${KLARA_API_URL}/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${KLARA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update stock: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('KLARA API Error:', error);
      throw error;
    }
  },

  async createOrder(order: {
    items: Array<{ productId: string; quantity: number }>;
    customer: {
      email: string;
      name: string;
      address?: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
      };
    };
    payment: {
      method: 'card' | 'twint' | 'paypal';
      details?: any;
    };
  }) {
    try {
      if (!KLARA_API_KEY) {
        throw new Error('KLARA_API_KEY is not configured');
      }

      const response = await fetch(`${KLARA_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${KLARA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('KLARA API Error:', error);
      throw error;
    }
  }
};