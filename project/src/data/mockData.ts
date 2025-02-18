export const products = [
  {
    id: 'p1',
    name: 'Cantu Curling Cream',
    description: 'Feuchtigkeitsspendende Lockencreme für definierte und gepflegte Locken',
    price: 14.90,
    image: 'https://images.unsplash.com/photo-1617391765934-f7ac7aa648bc?w=800',
    category: 'Styling',
    brand: 'Cantu',
    inStock: true
  },
  {
    id: 'p2',
    name: 'Shea Moisture Shampoo',
    description: 'Sulfatfreies Shampoo für natürliches und chemisch behandeltes Haar',
    price: 16.90,
    image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800',
    category: 'Pflege',
    brand: 'Shea Moisture',
    inStock: true
  },
  {
    id: 'p3',
    name: 'As I Am Coconut Cowash',
    description: 'Reinigendes Co-Wash für lockiges und krauses Haar',
    price: 18.90,
    image: 'https://images.unsplash.com/photo-1626806787461-a15f796d150d?w=800',
    category: 'Pflege',
    brand: 'As I Am',
    inStock: false
  },
  {
    id: 'p4',
    name: 'Denman Brush',
    description: 'Professionelle Haarbürste für perfektes Styling',
    price: 12.90,
    image: 'https://images.unsplash.com/photo-1590159763121-7c9fd312190d?w=800',
    category: 'Zubehör',
    brand: 'Denman',
    inStock: true
  },
  {
    id: 'p5',
    name: 'Cantu Leave-in Conditioner',
    description: 'Feuchtigkeitsspendender Leave-in Conditioner für geschmeidiges Haar',
    price: 13.90,
    image: 'https://images.unsplash.com/photo-1597354984706-fac992d9306f?w=800',
    category: 'Pflege',
    brand: 'Cantu',
    inStock: true
  }
];

export const services = [
  {
    id: 'cut-style',
    name: 'Haarschnitt & Styling',
    description: 'Professioneller Haarschnitt mit Styling',
    duration: 60,
    price: 80,
    category: 'hair',
  },
  {
    id: 'color',
    name: 'Färben',
    description: 'Premium Haarfarbe mit Pflege',
    duration: 120,
    price: 120,
    category: 'hair',
  },
  {
    id: 'treatment',
    name: 'Luxus-Behandlung',
    description: 'Intensive Haarpflege mit hochwertigen Produkten',
    duration: 45,
    price: 60,
    category: 'hair',
  },
];

export const packages = [
  {
    id: 'platinum',
    name: 'Paket Platinum',
    description: 'Das ultimative Verwöhnprogramm für höchste Ansprüche',
    services: services,
    price: 260,
    discountPercentage: 15,
  },
  {
    id: 'gold',
    name: 'Paket Gold',
    description: 'Perfekte Kombination aus Pflege und Styling',
    services: [services[0], services[1]],
    price: 180,
    discountPercentage: 10,
  },
  {
    id: 'silver',
    name: 'Paket Silber',
    description: 'Klassische Behandlung für den gepflegten Look',
    services: [services[0]],
    price: 80,
    discountPercentage: 0,
  },
];

export const salonInfo = {
  name: 'Meliyah afro-shop',
  description: 'Ihr Spezialist für Afro-Haarpflege in Frauenfeld',
  address: 'Rheinstrasse 21, 8500 Frauenfeld',
  phone: '0774471179',
  email: 'booking@meliyahafrohair.ch',
  openingHours: {
    'Montag': { open: 'Geschlossen', close: 'Geschlossen' },
    'Dienstag': { open: '10:30', close: '18:30' },
    'Mittwoch': { open: '10:30', close: '18:30' },
    'Donnerstag': { open: '10:30', close: '18:30' },
    'Freitag': { open: '10:30', close: '18:30' },
    'Samstag': { open: '10:30', close: '17:00' },
    'Sonntag': { open: 'Geschlossen', close: 'Geschlossen' },
  },
  images: [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    'https://images.unsplash.com/photo-1633681926035-ec1ac984418a?w=800', 
    'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800'
  ]
};

export const employees = [
  {
    id: '1',
    name: 'Carole Gbati',
    role: 'Afro Hair Specialist',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800',
    bio: 'Mit über 15 Jahren Erfahrung in der Pflege von Afro-Haaren und Braiding-Techniken. Spezialisiert auf natürliche Haarpflege und traditionelle afrikanische Flechtfrisuren.',
    specialties: ['Afro Hair', 'Braids', 'Natural Hair Care', 'Protective Styles'],
    availability: {
      'Montag': [],
      'Dienstag': [
        { time: '10:30', available: true },
        { time: '12:30', available: true },
        { time: '14:30', available: true },
        { time: '16:30', available: true },
      ],
      'Mittwoch': [
        { time: '10:30', available: true },
        { time: '12:30', available: true },
        { time: '14:30', available: true },
        { time: '16:30', available: true },
      ],
      'Donnerstag': [
        { time: '10:30', available: true },
        { time: '12:30', available: true },
        { time: '14:30', available: true },
        { time: '16:30', available: true },
      ],
      'Freitag': [
        { time: '10:30', available: true },
        { time: '12:30', available: true },
        { time: '14:30', available: true },
        { time: '16:30', available: true },
      ],
      'Samstag': [
        { time: '10:30', available: true },
        { time: '12:30', available: true },
        { time: '14:30', available: true },
      ],
      'Sonntag': [],
    },
  }
];