export interface Property {
  id: number;
  name: string;
  type: 'Villa' | 'Apartment' | 'Land to Landmark' | string;
  status: 'Ongoing' | 'Completed';
  location: string;
  area: string;
  price: number;
  priceDisplay: string;
  bhk: string;
  sqft: number;
  landArea?: string;
  image: string;
  images: string[];
  amenities: string[];
  description: string;
  nearby: { name: string; distance: string }[];
  featured: boolean;
  coordinates: { 
    lat: number; 
    lng: number; 
    formatted_address?: string;
    place_id?: string;
    latitude?: number;
    longitude?: number;
  };
  brochurePdf?: string;
  virtualTourLink?: string;
  floorPlan?: string;
  tagline?: string;
  story?: string;
}

export const properties: Property[] = [];

export const locations = [
  'Kochi, Kerala',
  'Trivandrum, Kerala',
  'Thrissur, Kerala',
  'Kottayam, Kerala',
  'Calicut, Kerala',
  'Alappuzha, Kerala',
];

export const stats = [
  { value: 'Turnkey', suffix: '', label: 'End-to-End Delivery' },
  { value: 'Quality', suffix: '', label: 'Focused Approach' },
  { value: 'Kerala', suffix: '', label: 'Project Locations' },
];

export const testimonials = [
  {
    id: 1,
    name: 'Mr. Rajesh M.A.',
    role: 'Client',
    location: 'Puthenvelikkara, Ernakulam',
    image: '',
    text: 'A place where expectations meet reality with perfection.',
  },
  {
    id: 2,
    name: 'Mr. Jinesh Gopalan',
    role: 'Client',
    location: 'Kalavoor, Alappuzha',
    image: '',
    text: "Lokah Builders delivered our dream home with exceptional quality and care. Their team's professionalism and attention to detail exceeded our expectations.",
  },
  {
    id: 3,
    name: 'Mr. Udayakumar',
    role: 'Client',
    location: 'Nemmara, Palakkad',
    image: '',
    text: "The entire experience was seamless from planning to completion. Lokah's commitment to quality, timelines and communication made all the difference.",
  },
  {
    id: 4,
    name: 'Mr. Saraun Babu',
    role: 'Client',
    location: 'Thathappilly, Ernakulam',
    image: '',
    text: "Working with Lokah was a truly positive experience. Their design sense, transparency and execution standards are remarkable.",
  },
];

export const lifestyleImages = [
  {
    image: '/images/hero/home-hero.jpg',
    title: 'Floor Plans',
    description: 'Thoughtfully mapped layouts for every home',
  },
  {
    image: '/images/services/interior-exterior.jpg',
    title: 'Interiors',
    description: 'Spaces crafted for elegance',
  },
  {
    image: '/images/services/property-development.jpg',
    title: 'Architectures',
    description: 'Striking structural design',
  },
];
