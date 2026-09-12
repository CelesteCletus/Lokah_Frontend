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

// TODO: SAMPLE DATA — awaiting the client's real project portfolio (names, status, location,
// pricing, sqft, amenities, photos, nearby landmarks, brochure/virtual-tour links per
// the Content Checklist, item 5). Do not launch with this fictional data still in place.
export const properties: Property[] = [
  {
    id: 1,
    name: 'The Royal Palm Villa',
    type: 'Villa',
    status: 'Completed',
    location: 'Kochi, Kerala',
    area: 'Kakkanad',
    price: 18500000,
    priceDisplay: '₹1.85 Cr',
    bhk: '4 BHK',
    sqft: 5200,
    landArea: '15 Cents',
    image: '/images/projects/completed-1.jpg',
    images: [
      '/images/projects/completed-1.jpg',
      '/images/services/interior-exterior.jpg',
      '/images/hero/home-hero.jpg',
    ],
    amenities: ['Private Pool', 'Smart Home', 'Home Theater', 'Wine Cellar', 'Garden', 'Security', 'Car Garage'],
    description: 'An architectural masterpiece blending modern elegance with traditional charm. This 4 BHK villa features premium Italian marble flooring, a private infinity pool, and panoramic views of the lush green surroundings.',
    nearby: [
      { name: 'Lulu Mall', distance: '5 km' },
      { name: 'Cochin International Airport', distance: '25 km' },
      { name: 'SmartCity', distance: '3 km' },
    ],
    featured: true,
    coordinates: { lat: 10.0121, lng: 76.3532 },
  },
  {
    id: 2,
    name: 'Azure Heights',
    type: 'Apartment',
    status: 'Completed',
    location: 'Trivandrum, Kerala',
    area: 'Technopark',
    price: 9500000,
    priceDisplay: '₹95 Lakhs',
    bhk: '3 BHK',
    sqft: 2400,
    image: '/images/projects/completed-2.jpg',
    images: [
      '/images/projects/completed-2.jpg',
      '/images/services/interior-exterior.jpg',
      '/images/hero/projects-hero.jpg',
    ],
    amenities: ['Clubhouse', 'Gym', 'Swimming Pool', 'Tennis Court', 'Jogging Track', '24/7 Security', 'Power Backup'],
    description: 'Luxury high-rise living at its finest. Azure Heights offers breathtaking sea views, world-class amenities, and proximity to the IT hub of Trivandrum.',
    nearby: [
      { name: 'Technopark Phase 3', distance: '1 km' },
      { name: 'Kovalam Beach', distance: '8 km' },
      { name: 'Trivandrum Airport', distance: '12 km' },
    ],
    featured: true,
    coordinates: { lat: 8.5563, lng: 76.8782 },
  },
  {
    id: 3,
    name: 'Golden Horizon Estate',
    type: 'Land to Landmark',
    status: 'Ongoing',
    location: 'Thrissur, Kerala',
    area: 'Guruvayur Road',
    price: 4500000,
    priceDisplay: '₹45 Lakhs',
    bhk: 'NA',
    sqft: 0,
    landArea: '25 Cents',
    image: '/images/services/property-development.jpg',
    images: [
      '/images/services/property-development.jpg',
      '/images/hero/services-hero.jpg',
    ],
    amenities: ['Corner Plot', 'Road Frontage', 'Well Water', 'Electricity Connection', 'Boundary Wall'],
    description: 'Prime residential plot in a fast-developing area. Perfect for building your dream home with excellent connectivity to Guruvayur and Thrissur city.',
    nearby: [
      { name: 'Guruvayur Temple', distance: '4 km' },
      { name: 'Thrissur Railway Station', distance: '15 km' },
      { name: 'NH 66', distance: '2 km' },
    ],
    featured: true,
    coordinates: { lat: 10.5195, lng: 76.2143 },
  },
  {
    id: 4,
    name: 'The Emerald Villa',
    type: 'Villa',
    status: 'Completed',
    location: 'Kottayam, Kerala',
    area: 'Kumarakom',
    price: 32000000,
    priceDisplay: '₹3.2 Cr',
    bhk: '5 BHK',
    sqft: 7500,
    landArea: '20 Cents',
    image: '/images/projects/completed-1.jpg',
    images: [
      '/images/projects/completed-1.jpg',
      '/images/services/interior-exterior.jpg',
      '/images/hero/about-hero.jpg',
    ],
    amenities: ['Private Lake Access', 'Infinity Pool', 'Ayurveda Spa', 'Outdoor BBQ', 'Boat Jetty', 'Staff Quarters', 'EV Charging'],
    description: 'A waterfront paradise overlooking the serene Vembanad Lake. This architectural gem features sustainable design, private boat access, and world-class luxury amenities.',
    nearby: [
      { name: 'Kumarakom Bird Sanctuary', distance: '2 km' },
      { name: 'Kumarakom Lake Resort', distance: '1 km' },
      { name: 'Kottayam Town', distance: '16 km' },
    ],
    featured: true,
    coordinates: { lat: 9.6167, lng: 76.4333 },
  },
  {
    id: 5,
    name: 'Platinum Towers',
    type: 'Apartment',
    status: 'Completed',
    location: 'Calicut, Kerala',
    area: 'Mavoor Road',
    price: 7200000,
    priceDisplay: '₹72 Lakhs',
    bhk: '3 BHK',
    sqft: 1850,
    image: '/images/projects/completed-2.jpg',
    images: [
      '/images/projects/completed-2.jpg',
      '/images/services/interior-exterior.jpg',
    ],
    amenities: ['Rooftop Infinity Pool', 'State-of-art Gym', 'Mini Theater', 'Party Hall', 'Kids Play Area', 'Car Parking'],
    description: 'Contemporary urban living in the heart of Calicut. Premium finishes, smart home features, and stunning city views make this a perfect investment.',
    nearby: [
      { name: 'Calicut Beach', distance: '4 km' },
      { name: 'Calicut Railway Station', distance: '2 km' },
      { name: 'Focus Mall', distance: '1 km' },
    ],
    featured: false,
    coordinates: { lat: 11.2575, lng: 75.7848 },
  },
  {
    id: 6,
    name: 'Royal Garden Villa',
    type: 'Villa',
    status: 'Completed',
    location: 'Kochi, Kerala',
    area: 'Panampilly Nagar',
    price: 15000000,
    priceDisplay: '₹1.5 Cr',
    bhk: '4 BHK',
    sqft: 3800,
    landArea: '12 Cents',
    image: '/images/projects/completed-1.jpg',
    images: [
      '/images/projects/completed-1.jpg',
      '/images/services/interior-exterior.jpg',
    ],
    amenities: ['Landscaped Garden', 'Solar Powered', 'Rainwater Harvesting', 'Modular Kitchen', 'Home Automation', '3 Car Garage'],
    description: 'An eco-luxury villa in Kochi\'s most prestigious neighborhood. Features sustainable design without compromising on opulence.',
    nearby: [
      { name: 'Lulu Mall', distance: '3 km' },
      { name: 'Marine Drive', distance: '4 km' },
      { name: 'Kochi Metro', distance: '500 m' },
    ],
    featured: false,
    coordinates: { lat: 9.9667, lng: 76.3000 },
  },
  {
    id: 7,
    name: 'Sunrise Valley Plot',
    type: 'Land to Landmark',
    status: 'Completed',
    location: 'Alappuzha, Kerala',
    area: 'Cherthala',
    price: 2800000,
    priceDisplay: '₹28 Lakhs',
    bhk: 'NA',
    sqft: 0,
    landArea: '18 Cents',
    image: '/images/services/property-development.jpg',
    images: [
      '/images/services/property-development.jpg',
      '/images/hero/services-hero.jpg',
    ],
    amenities: ['Road Access', 'Water Connection', 'Electricity', 'Compound Wall', 'Paved Driveway'],
    description: 'Serene and peaceful residential plot in the backwater region of Alappuzha. Ideal for a vacation home or retreat.',
    nearby: [
      { name: 'Alappuzha Beach', distance: '10 km' },
      { name: 'Vembanad Lake', distance: '2 km' },
      { name: 'NH 47', distance: '3 km' },
    ],
    featured: false,
    coordinates: { lat: 9.5429, lng: 76.3444 },
  },
  {
    id: 8,
    name: 'Infinity Sky Residences',
    type: 'Apartment',
    status: 'Ongoing',
    location: 'Kochi, Kerala',
    area: 'Edappally',
    price: 12500000,
    priceDisplay: '₹1.25 Cr',
    bhk: '4 BHK',
    sqft: 3200,
    image: '/images/projects/ongoing-1.jpg',
    images: [
      '/images/projects/ongoing-1.jpg',
      '/images/projects/ongoing-2.jpg',
    ],
    amenities: ['Sky Lounge', 'Helipad Access', 'Concierge Service', 'Private Elevator', 'Smart Home', 'Premium Gym', 'Infinity Pool'],
    description: 'Ultra-premium high-rise residences offering unparalleled luxury. Direct mall access and world-class amenities define this project.',
    nearby: [
      { name: 'Lulu Mall', distance: '200 m' },
      { name: 'Edappally Metro', distance: '500 m' },
      { name: 'NH 66', distance: '1 km' },
    ],
    featured: true,
    coordinates: { lat: 10.0293, lng: 76.3075 },
  },
];

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
