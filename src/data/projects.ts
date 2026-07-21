export interface Project {
  id: string;
  src: string;
  gallery: string[];
  label: string;
  sub: string;
  location: string;
  area: string;
  type: string;
  status: 'Completed' | 'Under Construction' | 'Upcoming';
  year: string;
  description: string;
  longDescription: string;
  highlights: string[];
  accent: string;
  specs: { label: string; value: string }[];
}

export const projects: Project[] = [
  {
    id: 'grand-facade',
    src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd28?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    ],
    label: 'The Grand Facade',
    sub: 'Architecture',
    location: 'Bandra West, Mumbai',
    area: '4,20,000 sq. ft.',
    type: 'Mixed-Use Tower',
    status: 'Completed',
    year: '2023',
    description: 'A landmark mixed-use tower that redefines the Bandra skyline with 32 storeys of premium living.',
    longDescription:
      "The Grand Facade stands as Brickly Homes' most celebrated mixed-use development, seamlessly blending 32 storeys of premium residences with a vibrant 4-floor retail podium. Floor-to-ceiling glazing on every unit frames unobstructed Arabian Sea views, while the double-height sky lobby and cantilevered sky lounge have become architectural icons of the Bandra West neighbourhood. The project achieved LEED Gold certification, incorporating rainwater harvesting, solar panels, and triple-glazed façades that reduce energy consumption by 38% against baseline.",
    highlights: ['32 Floors', 'Sea-View Units', 'LEED Gold', 'Sky Lounge'],
    accent: '#c8a96e',
    specs: [
      { label: 'Total Units', value: '186' },
      { label: 'Floors', value: '32' },
      { label: 'Parking', value: '4 Basements' },
      { label: 'Retail Area', value: '60,000 sq. ft.' },
      { label: 'Architect', value: 'Studio Morphogen' },
      { label: 'RERA No.', value: 'P51900012345' },
    ],
  },
  {
    id: 'meridian-heights',
    src: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop',
    ],
    label: 'Meridian Heights',
    sub: 'Residential',
    location: 'Koregaon Park, Pune',
    area: '2,80,000 sq. ft.',
    type: 'Luxury Residences',
    status: 'Completed',
    year: '2022',
    description: 'A collection of 120 bespoke residences with private sky gardens and resort-style amenities.',
    longDescription:
      "Meridian Heights redefines luxury living in Pune's most coveted address. Spread across 4 acres of lushly landscaped grounds, the 120 homes — ranging from 2,400 to 6,800 sq. ft. — are each configured as private sanctuaries. Every 3rd-floor and above unit features a private sky garden planted with native species. The 1.2-acre resort-style pool deck, concierge, and curated art collection throughout the common areas position Meridian Heights as Pune's premier address for discerning homeowners.",
    highlights: ['120 Units', 'Sky Gardens', '5-Star Amenities', 'Smart Home'],
    accent: '#7eb8a4',
    specs: [
      { label: 'Total Units', value: '120' },
      { label: 'Unit Size', value: '2,400 – 6,800 sq. ft.' },
      { label: 'Floors', value: '18' },
      { label: 'Site Area', value: '4 Acres' },
      { label: 'Architect', value: 'Opolis Studio' },
      { label: 'RERA No.', value: 'P52100023456' },
    ],
  },
  {
    id: 'skyline-signature',
    src: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=2000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460574283810-2aab119d8511?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    ],
    label: 'Skyline Signature',
    sub: 'Commercial',
    location: 'Whitefield, Bangalore',
    area: '6,50,000 sq. ft.',
    type: 'Grade-A Office Campus',
    status: 'Under Construction',
    year: '2025',
    description: 'A next-generation Grade-A campus with biophilic interiors and net-zero infrastructure.',
    longDescription:
      'Skyline Signature is our most ambitious commercial undertaking — a 6.5 lakh sq. ft. Grade-A office campus purpose-built for the future of work. Four interconnected towers share a landscaped central spine with food courts, wellness facilities, and an on-site innovation hub. Every floor plate is column-free (40,000 sq. ft.), maximising layout flexibility for enterprise tenants. The campus is designed to achieve IGBC Platinum and net-zero operational carbon, powered by a 2.4 MW rooftop solar array.',
    highlights: ['Campus Style', 'Biophilic Design', 'Net-Zero Ready', 'Innovation Hub'],
    accent: '#8c7eb8',
    specs: [
      { label: 'Total Area', value: '6,50,000 sq. ft.' },
      { label: 'Towers', value: '4' },
      { label: 'Floor Plate', value: '40,000 sq. ft.' },
      { label: 'Parking', value: '2,400 Bays' },
      { label: 'Architect', value: 'Hafeez Contractor' },
      { label: 'RERA No.', value: 'PRM/KA/RERA/1234' },
    ],
  },
  {
    id: 'elevated-living',
    src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd28?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop',
    ],
    label: 'Elevated Living',
    sub: 'Premium Estates',
    location: 'Juhu, Mumbai',
    area: '1,10,000 sq. ft.',
    type: 'Ultra-Luxury Villas',
    status: 'Completed',
    year: '2024',
    description: 'Eight ultra-luxury beachside villas each with a private pool, home theatre, and wine cellar.',
    longDescription:
      "Elevated Living is an exclusive enclave of eight ultra-luxury villas — each a standalone masterpiece — located a stone's throw from Juhu's iconic beach. Ranging from 8,000 to 12,000 sq. ft. across three levels, every villa is delivered fully fitted with a private 40-foot lap pool, temperature-controlled wine cellar, Dolby Atmos home theatre, and staff quarters. Three villas offer private beach access through a dedicated gated pathway.",
    highlights: ['8 Villas', 'Private Pool', 'Home Theatre', 'Beach Access'],
    accent: '#b8947e',
    specs: [
      { label: 'Total Villas', value: '8' },
      { label: 'Villa Size', value: '8,000 – 12,000 sq. ft.' },
      { label: 'Floors', value: 'G+2' },
      { label: 'Pool Size', value: '40 ft. Lap Pool' },
      { label: 'Architect', value: 'Nalendra & Associates' },
      { label: 'RERA No.', value: 'P51900045678' },
    ],
  },
  {
    id: 'detail-within',
    src: 'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=1600&auto=format&fit=crop',
    ],
    label: 'The Detail Within',
    sub: 'Craft & Finish',
    location: 'Indiranagar, Bangalore',
    area: '90,000 sq. ft.',
    type: 'Boutique Residences',
    status: 'Completed',
    year: '2023',
    description: 'A boutique mid-rise where every surface is an act of artisanal craft — Makrana marble, aged brass, hand-trowelled plaster.',
    longDescription:
      'The Detail Within is a passion project — a 36-unit boutique mid-rise that rejects the generic and champions the handcrafted. Working with master craftsmen across India, we curated every surface, every fixture, and every fitting. The lobby doubles as an art gallery, housing rotating exhibitions from emerging Indian artists. Makrana marble floors, aged brass tapware, hand-trowelled Venetian plaster walls, and bespoke teak joinery combine to create a sensory experience unlike any other residential development in Bangalore.',
    highlights: ['36 Residences', 'Bespoke Finishes', 'Art Gallery Lobby', 'Rooftop Garden'],
    accent: '#a8b87e',
    specs: [
      { label: 'Total Units', value: '36' },
      { label: 'Unit Size', value: '1,800 – 3,600 sq. ft.' },
      { label: 'Floors', value: '8' },
      { label: 'Lobby Art', value: 'Rotating Exhibition' },
      { label: 'Architect', value: 'Biome Architects' },
      { label: 'RERA No.', value: 'PRM/KA/RERA/5678' },
    ],
  },
];
