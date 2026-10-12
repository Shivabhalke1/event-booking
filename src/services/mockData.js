/**
 * Initial Mock Data for Fallback & Immediate Demonstration
 * Pre-seeded with rich Indian and international tech/cultural events
 */

export const INITIAL_PROFILES = [
  {
    id: 'user-aiml-customer',
    full_name: 'Shreya L Shetty',
    email: 'shreya.shetty@team-aiml.edu',
    role: 'customer',
    created_at: new Date('2026-01-15').toISOString()
  },
  {
    id: 'user-aiml-organizer',
    full_name: 'Varalakshmi T J',
    email: 'varalakshmi@team-aiml.edu',
    role: 'organizer',
    created_at: new Date('2026-01-10').toISOString()
  },
  {
    id: 'user-aiml-admin',
    full_name: 'S Monish & Sagar',
    email: 'leads@team-aiml.edu',
    role: 'admin',
    created_at: new Date('2026-01-01').toISOString()
  }
];

export const INITIAL_EVENTS = [
  {
    id: 'evt-ai-summit-2026',
    organizer_id: 'user-aiml-organizer',
    title: 'Global AI & Deep Learning Summit 2026',
    description: 'Join industry pioneers, researchers, and ML practitioners exploring generative AI, multimodal agents, and neural architectures. Featuring keynote talks, hands-on lab sessions, and startup showcase.',
    category: 'Tech',
    venue: 'KTPO Convention Center, Whitefield, Bengaluru',
    start_time: '2026-11-14T09:30:00Z',
    end_time: '2026-11-15T18:00:00Z',
    ticket_price: 1499.00,
    total_capacity: 450,
    available_tickets: 182,
    banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    is_published: true,
    created_at: '2026-09-01T10:00:00Z'
  },
  {
    id: 'evt-indie-music-fest',
    organizer_id: 'user-aiml-organizer',
    title: 'Sonic Echoes: Indie Rock & Electronic Music Fest',
    description: 'An open-air evening celebrating premier independent music acts, immersive laser visualizers, artisan food trucks, and acoustic sunset sessions.',
    category: 'Music',
    venue: 'Jayamahal Palace Lawns, Bengaluru',
    start_time: '2026-10-24T16:00:00Z',
    end_time: '2026-10-24T23:30:00Z',
    ticket_price: 899.00,
    total_capacity: 1200,
    available_tickets: 430,
    banner_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    is_published: true,
    created_at: '2026-09-05T14:30:00Z'
  },
  {
    id: 'evt-uiux-bootcamp',
    organizer_id: 'user-aiml-organizer',
    title: 'Mastering Modern UI/UX & Motion Systems Workshop',
    description: 'An intensive hands-on masterclass covering Figma design systems, micro-interactions, responsive tokens, and developer handoff best practices.',
    category: 'Workshop',
    venue: 'WeWork Galaxy, Residency Road, Bengaluru',
    start_time: '2026-11-08T10:00:00Z',
    end_time: '2026-11-08T17:00:00Z',
    ticket_price: 499.00,
    total_capacity: 80,
    available_tickets: 12,
    banner_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    is_published: true,
    created_at: '2026-09-12T09:15:00Z'
  },
  {
    id: 'evt-marathon-2026',
    organizer_id: 'user-aiml-organizer',
    title: 'Bengaluru Midnight 10K & Half Marathon',
    description: 'Lace up your running shoes for the most electrifying night race under illuminated city boulevards. Finisher medals, timing chips, and hydration zones included.',
    category: 'Sports',
    venue: 'Kanteerava Outdoor Stadium, Bengaluru',
    start_time: '2026-12-05T21:00:00Z',
    end_time: '2026-12-06T03:00:00Z',
    ticket_price: 650.00,
    total_capacity: 800,
    available_tickets: 240,
    banner_url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1200&q=80',
    is_published: true,
    created_at: '2026-09-15T11:00:00Z'
  },
  {
    id: 'evt-dandiya-night',
    organizer_id: 'user-aiml-organizer',
    title: 'Grand Navratri Dandiya & Garba Raas Extravaganza',
    description: 'Experience traditional beats, live dhol orchestra, ethnic dress competitions, and traditional gourmet street food stalls.',
    category: 'Music',
    venue: 'Manpho Convention Centre, Nagavara, Bengaluru',
    start_time: '2026-10-18T18:30:00Z',
    end_time: '2026-10-18T23:59:00Z',
    ticket_price: 399.00,
    total_capacity: 1500,
    available_tickets: 580,
    banner_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    is_published: true,
    created_at: '2026-09-18T16:20:00Z'
  },
  {
    id: 'evt-web3-hackathon',
    organizer_id: 'user-aiml-organizer',
    title: 'NextGen Decentralized Web3 Hackathon & Pitch',
    description: '36 hours of nonstop building, smart contract audits, mentor office hours, and ₹5,00,000 in bounties for winning decentralized applications.',
    category: 'Tech',
    venue: 'Innov8 Coworking Hub, Koramangala, Bengaluru',
    start_time: '2026-11-28T08:00:00Z',
    end_time: '2026-11-29T20:00:00Z',
    ticket_price: 0.00,
    total_capacity: 250,
    available_tickets: 45,
    banner_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    is_published: true,
    created_at: '2026-09-22T08:45:00Z'
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'bkg-demo-001',
    booking_reference: 'TKT-D1-9K2L-7482',
    event_id: 'evt-ai-summit-2026',
    user_id: 'user-aiml-customer',
    tickets_count: 2,
    total_amount: 2998.00,
    booking_status: 'confirmed',
    created_at: '2026-09-25T14:22:00Z'
  },
  {
    id: 'bkg-demo-002',
    booking_reference: 'TKT-D1-3V8X-1934',
    event_id: 'evt-uiux-bootcamp',
    user_id: 'user-aiml-customer',
    tickets_count: 1,
    total_amount: 499.00,
    booking_status: 'confirmed',
    created_at: '2026-09-28T19:40:00Z'
  }
];

// Local Storage helpers for reliable state management across reloads
export const getLocalData = (key, fallback) => {
  try {
    const data = localStorage.getItem(`aiml_d1_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const setLocalData = (key, value) => {
  try {
    localStorage.setItem(`aiml_d1_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage error:', e);
  }
};
