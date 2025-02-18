export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  services: Service[];
  price: number;
  discountPercentage: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  specialties: string[];
  availability: {
    [key: string]: TimeSlot[];
  };
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  packageId: string;
  employeeId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'paid';
  totalPrice: number;
  products?: Product[];
  reminderEmail?: boolean;
  reminderSMS?: boolean;
  paymentStatus: 'pending' | 'completed';
  paymentMethod?: 'card' | 'twint' | 'cash';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookings: string[];
}

export interface SalonInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  openingHours: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  inStock: boolean;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  name: string;
}