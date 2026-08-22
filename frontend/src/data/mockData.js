// GlobeTrotter Pre-seeded Database & Mock Data

export const INITIAL_USER = {
  id: 'u-101-alex',
  name: 'Alex Explorer',
  email: 'alex.explorer@globetrotter.io',
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  languagePref: 'en',
  stats: {
    totalTrips: 5,
    upcomingTrips: 2,
    budgetSavings: 1200,
  }
};

export const CITIES_DATA = [
  {
    id: 'c-paris',
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    costIndex: 1.45,
    popularityScore: 4.95,
    tag: 'Cultural Capital',
    priceLevel: '$$$',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    description: 'The City of Light dazzles with iconic monuments, world-class art museums, bohemian quarters, and gourmet culinary experiences.',
    activities: [
      {
        id: 'act-paris-1',
        name: 'Check-in at Le Meurice',
        category: 'Lodging',
        cost: 1200.00,
        durationMins: 60,
        timeSlot: '14:00',
        description: 'Settle into the hotel and enjoy the view. A relaxed start to the trip.',
        imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-paris-2',
        name: 'Dinner at Le Jules Verne',
        category: 'Food & Dining',
        cost: 600.00,
        durationMins: 120,
        timeSlot: '19:30',
        description: 'Exquisite Michelin-starred dining experience located in the Eiffel Tower.',
        imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-paris-3',
        name: 'Louvre Museum Tour',
        category: 'Culture & History',
        cost: 45.00,
        durationMins: 180,
        timeSlot: '09:00',
        description: 'A guided tour of the worlds largest art museum including Mona Lisa and Venus de Milo.',
        imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-paris-4',
        name: 'Seine Sunset Cruise',
        category: 'Leisure',
        cost: 45.00,
        durationMins: 90,
        timeSlot: '18:30',
        description: 'Panoramic riverboat cruise along the Seine under twilight illumination.',
        imageUrl: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-paris-5',
        name: 'Eiffel Tower Summit',
        category: 'Sightseeing',
        cost: 38.00,
        durationMins: 120,
        timeSlot: '11:00',
        description: 'Ascend to the highest accessible platform for unobstructed views across the French capital.',
        imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'c-rome',
    name: 'Rome',
    country: 'Italy',
    region: 'Europe',
    costIndex: 1.25,
    popularityScore: 4.88,
    tag: 'Ancient Marvel',
    priceLevel: '$$$',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    description: 'The Eternal City where 2,000-year-old antiquity merges seamlessly with vibrant piazzas, espresso culture, and Roman pastas.',
    activities: [
      {
        id: 'act-rome-1',
        name: 'Colosseum & Roman Forum VIP Tour',
        category: 'Sightseeing',
        cost: 65.00,
        durationMins: 180,
        timeSlot: '09:30',
        description: 'Skip-the-line arena floor access and guided historical walk through the Palatine Hill.',
        imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-rome-2',
        name: 'Trastevere Street Food & Wine Tasting',
        category: 'Food & Dining',
        cost: 55.00,
        durationMins: 150,
        timeSlot: '18:30',
        description: 'Sample authentic supplì, handmade cacio e pepe, artisanal gelato, and local Lazio wines.',
        imageUrl: 'https://images.unsplash.com/photo-1533777857889-4be7c70e33f7?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-rome-3',
        name: 'Vatican Museums & Sistine Chapel',
        category: 'Culture & History',
        cost: 40.00,
        durationMins: 200,
        timeSlot: '14:00',
        description: 'Witness Michelangelos breathtaking frescoes and the Gallery of Maps in Vatican City.',
        imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-rome-4',
        name: 'Hotel Artemide Roma Stay',
        category: 'Lodging',
        cost: 1150.00,
        durationMins: 60,
        timeSlot: '15:00',
        description: 'Boutique accommodations on Via Nazionale with panoramic rooftop lounge.',
        imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'c-tokyo',
    name: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    costIndex: 1.30,
    popularityScore: 4.90,
    tag: 'Futuristic Metropolis',
    priceLevel: '$$$',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    description: 'Neon skylines, ancient tranquil shrines, cutting-edge gastronomy, and lightning-fast transit systems in Japans vibrant capital.',
    activities: [
      {
        id: 'act-tokyo-1',
        name: 'Senso-ji Temple & Asakusa Traditional Walk',
        category: 'Culture & History',
        cost: 0.00,
        durationMins: 120,
        timeSlot: '10:00',
        description: 'Explore Tokyos oldest temple and craft stalls along Nakamise-dori.',
        imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-tokyo-2',
        name: 'Shibuya Crossing & Harajuku Pop Tour',
        category: 'Sightseeing',
        cost: 15.00,
        durationMins: 150,
        timeSlot: '14:00',
        description: 'Experience the world-famous scramble intersection and Takeshita youth culture.',
        imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-tokyo-3',
        name: 'Tsukiji Outer Market Sushi Tasting',
        category: 'Food & Dining',
        cost: 50.00,
        durationMins: 90,
        timeSlot: '08:30',
        description: 'Taste fresh nigiri, wagyu skewers, and sweet tamagoyaki from artisan vendors.',
        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-tokyo-4',
        name: 'teamLab Borderless Digital Art Museum',
        category: 'Adventure',
        cost: 32.00,
        durationMins: 150,
        timeSlot: '16:00',
        description: 'Immerse into world-famous 3D interactive projections and mirror rooms.',
        imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'c-amalfi',
    name: 'Amalfi Coast',
    country: 'Italy',
    region: 'Europe',
    costIndex: 1.50,
    popularityScore: 4.92,
    tag: 'Coastal Region',
    priceLevel: '$$$',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    description: 'Dramatic cliffs dropping into the sparkling Tyrrhenian Sea with pastel-colored villages perched above turquoise waters.',
    activities: [
      {
        id: 'act-amalfi-1',
        name: 'Positano Coastal Boat Excursion',
        category: 'Sightseeing',
        cost: 85.00,
        durationMins: 240,
        timeSlot: '10:00',
        description: 'Cruise past the Emerald Grotto and swim in secluded Mediterranean coves.',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-amalfi-2',
        name: 'Path of the Gods Clifftop Hike',
        category: 'Adventure',
        cost: 25.00,
        durationMins: 210,
        timeSlot: '08:00',
        description: 'Spectacular trekking route suspended high above the coastline.',
        imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'c-barcelona',
    name: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    costIndex: 1.15,
    popularityScore: 4.85,
    tag: 'Urban Culture',
    priceLevel: '$$',
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    description: 'Gaudis modernist architectural masterpieces, sun-drenched beaches, Gothic alleyways, and world-renowned tapas bars.',
    activities: [
      {
        id: 'act-bcn-1',
        name: 'Sagrada Familia Fast-Track Tower Tour',
        category: 'Culture & History',
        cost: 36.00,
        durationMins: 120,
        timeSlot: '10:00',
        description: 'Explore Antoni Gaudis unfinished basilica and ascend the Nativity facade towers.',
        imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-bcn-2',
        name: 'Park Güell Morning Walk',
        category: 'Sightseeing',
        cost: 13.00,
        durationMins: 90,
        timeSlot: '08:30',
        description: 'Mosaic dragon fountains and panoramic views overlooking Barcelona to the Mediterranean.',
        imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-bcn-3',
        name: 'El Born Tapas Crawl & Sangria',
        category: 'Food & Dining',
        cost: 45.00,
        durationMins: 150,
        timeSlot: '20:00',
        description: 'Iberian jamón, patatas bravas, pimientos de padrón and Catalan vermouth.',
        imageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'c-marrakech',
    name: 'Marrakech',
    country: 'Morocco',
    region: 'Africa',
    costIndex: 0.85,
    popularityScore: 4.75,
    tag: 'Historic Oasis',
    priceLevel: '$$',
    imageUrl: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=1200&q=80',
    description: 'A sensory explosion of bustling souks, spice fragrances, serene riad courtyards, and palatial architecture.',
    activities: [
      {
        id: 'act-mar-1',
        name: 'Jemaa el-Fnaa Night Market Tour',
        category: 'Food & Dining',
        cost: 30.00,
        durationMins: 120,
        timeSlot: '19:00',
        description: 'Live musicians, snake charmers, Moroccan mint tea, and tagines.',
        imageUrl: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'c-highlands',
    name: 'Scottish Highlands',
    country: 'United Kingdom',
    region: 'Europe',
    costIndex: 1.10,
    popularityScore: 4.78,
    tag: 'Scenic Nature',
    priceLevel: '$$',
    imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80',
    description: 'Untamed mountains, misty lochs, medieval castles, and winding scenic driving routes.',
    activities: [
      {
        id: 'act-high-1',
        name: 'Isle of Skye Fairy Pools Trek',
        category: 'Adventure',
        cost: 20.00,
        durationMins: 180,
        timeSlot: '10:00',
        description: 'Hike along crystal clear blue cascading pools at the foot of the Black Cuillins.',
        imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'c-canyon',
    name: 'Grand Canyon',
    country: 'United States',
    region: 'North America',
    costIndex: 1.20,
    popularityScore: 4.89,
    tag: 'Natural Wonder',
    priceLevel: '$$',
    imageUrl: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1200&q=80',
    description: 'Vast layered bands of red rock revealing millions of years of geological history under radiant desert skies.',
    activities: [
      {
        id: 'act-can-1',
        name: 'Bright Angel Trail Sunset Hike',
        category: 'Adventure',
        cost: 0.00,
        durationMins: 150,
        timeSlot: '17:00',
        description: 'Spectacular views from the South Rim into the canyon abyss as the sun dips.',
        imageUrl: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
];

export const INITIAL_TRIPS = [
  {
    id: 'trip-european-summer',
    userId: 'u-101-alex',
    name: 'European Summer',
    subtitle: 'Paris & Rome',
    startDate: '2024-06-15',
    endDate: '2024-06-30',
    status: 'upcoming',
    isPublic: true,
    shareToken: 'european-summer-2024',
    coverPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=85',
    description: 'An unforgettable 15-day summer journey exploring the romantic avenues of Paris and the eternal monuments of Rome.',
    author: {
      name: 'Alex Explorer',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    budget: {
      totalBudget: 5000.00,
      dailyCap: 350.00,
      categoryBreakdown: {
        lodging: 2350.00,
        food: 1200.00,
        activities: 650.00,
        transport: 0.00
      }
    },
    stops: [
      {
        id: 'stop-paris',
        cityId: 'c-paris',
        cityName: 'Paris',
        country: 'France',
        arrivalDate: '2024-06-15',
        departureDate: '2024-06-20',
        sortOrder: 0,
        estCost: 1890.00,
        activities: [
          {
            id: 'ta-p1',
            day: 1,
            dayTitle: 'Day 1: Arrival in Paris',
            name: 'Check-in at Le Meurice',
            category: 'Lodging',
            cost: 1200.00,
            timeSlot: '14:00',
            description: 'Settle into the hotel and enjoy the view. A relaxed start to the trip.',
            imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
            sortOrder: 0
          },
          {
            id: 'ta-p2',
            day: 1,
            dayTitle: 'Day 1: Arrival in Paris',
            name: 'Dinner at Le Jules Verne',
            category: 'Food & Dining',
            cost: 600.00,
            timeSlot: '19:30',
            description: 'Exquisite Michelin-starred dining experience located inside the Eiffel Tower.',
            imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
            sortOrder: 1
          },
          {
            id: 'ta-p3',
            day: 2,
            dayTitle: 'Day 2: Art & Culture',
            name: 'Louvre Museum Tour',
            category: 'Culture & History',
            cost: 45.00,
            timeSlot: '09:00',
            description: 'A guided tour of the worlds largest art museum including Mona Lisa and Greek sculptures.',
            imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80',
            sortOrder: 2
          },
          {
            id: 'ta-p4',
            day: 2,
            dayTitle: 'Day 2: Art & Culture',
            name: 'Seine Sunset Cruise',
            category: 'Leisure',
            cost: 45.00,
            timeSlot: '18:30',
            description: 'Serene evening cruise down the Seine river taking in illuminated bridges.',
            imageUrl: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=800&q=80',
            sortOrder: 3
          }
        ]
      },
      {
        id: 'stop-rome',
        cityId: 'c-rome',
        cityName: 'Rome',
        country: 'Italy',
        arrivalDate: '2024-06-21',
        departureDate: '2024-06-26',
        sortOrder: 1,
        estCost: 1400.00,
        activities: [
          {
            id: 'ta-r1',
            day: 3,
            dayTitle: 'Day 3: Ancient Rome Marvels',
            name: 'Colosseum & Roman Forum VIP Tour',
            category: 'Sightseeing',
            cost: 65.00,
            timeSlot: '09:30',
            description: 'Gladiator arena floor access and guided historical walk through antiquity.',
            imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
            sortOrder: 0
          },
          {
            id: 'ta-r2',
            day: 3,
            dayTitle: 'Day 3: Ancient Rome Marvels',
            name: 'Trastevere Street Food & Wine Tour',
            category: 'Food & Dining',
            cost: 55.00,
            timeSlot: '18:30',
            description: 'Sample handmade cacio e pepe, artisanal supplì and Lazio wines.',
            imageUrl: 'https://images.unsplash.com/photo-1533777857889-4be7c70e33f7?auto=format&fit=crop&w=800&q=80',
            sortOrder: 1
          },
          {
            id: 'ta-r3',
            day: 4,
            dayTitle: 'Day 4: Vatican City & Art Treasures',
            name: 'Vatican Museums & Sistine Chapel',
            category: 'Culture & History',
            cost: 40.00,
            timeSlot: '14:00',
            description: 'Michelangelos ceiling frescoes, Saint Peters Basilica, and Vatican courtyards.',
            imageUrl: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=800&q=80',
            sortOrder: 2
          },
          {
            id: 'ta-r4',
            day: 4,
            dayTitle: 'Day 4: Vatican City & Art Treasures',
            name: 'Hotel Artemide Roma Stay',
            category: 'Lodging',
            cost: 1150.00,
            timeSlot: '15:00',
            description: 'Boutique stay near the Spanish Steps with breakfast buffet.',
            imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
            sortOrder: 3
          }
        ]
      }
    ]
  },
  {
    id: 'trip-tokyo-tech',
    userId: 'u-101-alex',
    name: 'Tokyo Tech Tour',
    subtitle: 'Tokyo',
    startDate: '2024-09-10',
    endDate: '2024-09-20',
    status: 'upcoming',
    isPublic: true,
    shareToken: 'tokyo-tech-tour-2024',
    coverPhoto: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85',
    description: 'A 10-day immersive adventure exploring neon-drenched Tokyo, cutting-edge tech hubs, robotics cafes, and centuries-old culinary masters.',
    author: {
      name: 'Alex Explorer',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    budget: {
      totalBudget: 4800.00,
      dailyCap: 400.00,
      categoryBreakdown: {
        lodging: 380.00,
        food: 50.00,
        activities: 47.00,
        transport: 0.00
      }
    },
    stops: [
      {
        id: 'stop-tokyo',
        cityId: 'c-tokyo',
        cityName: 'Tokyo',
        country: 'Japan',
        arrivalDate: '2024-09-10',
        departureDate: '2024-09-20',
        sortOrder: 0,
        estCost: 477.00,
        activities: [
          {
            id: 'ta-t1',
            day: 1,
            dayTitle: 'Day 1: Arrival & Asakusa',
            name: 'Senso-ji Temple & Asakusa Traditional Walk',
            category: 'Culture & History',
            cost: 0.00,
            timeSlot: '10:00',
            description: 'Visit Tokyos oldest Buddhist temple and browse craft shops.',
            imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
            sortOrder: 0
          },
          {
            id: 'ta-t2',
            day: 1,
            dayTitle: 'Day 1: Arrival & Asakusa',
            name: 'Shibuya Crossing & Harajuku Pop-Culture Safari',
            category: 'Sightseeing',
            cost: 15.00,
            timeSlot: '14:00',
            description: 'Experience the world-famous scramble crossing and Takeshita Street fashion.',
            imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
            sortOrder: 1
          },
          {
            id: 'ta-t3',
            day: 2,
            dayTitle: 'Day 2: Gastronomy & Future Art',
            name: 'Tsukiji Outer Market Sushi Tasting',
            category: 'Food & Dining',
            cost: 50.00,
            timeSlot: '08:30',
            description: 'Taste fresh sushi, grilled seafood skewers, and tamagoyaki.',
            imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
            sortOrder: 2
          },
          {
            id: 'ta-t4',
            day: 2,
            dayTitle: 'Day 2: Gastronomy & Future Art',
            name: 'teamLab Borderless Digital Art Museum',
            category: 'Adventure',
            cost: 32.00,
            timeSlot: '16:00',
            description: 'Immerse into interactive 3D digital projection art world.',
            imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
            sortOrder: 3
          }
        ]
      }
    ]
  },
  {
    id: 'trip-highlands',
    userId: 'u-101-alex',
    name: 'Scottish Highlands',
    subtitle: 'Highlands & Isle of Skye',
    startDate: '2023-05-10',
    endDate: '2023-05-20',
    status: 'past',
    dateLabel: 'May 2023',
    isPublic: true,
    shareToken: 'scottish-highlands-2023',
    coverPhoto: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80',
    description: 'A serene road trip through misty mountains, ancient castles, and fairy pools.',
    author: {
      name: 'Alex Explorer',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    budget: {
      totalBudget: 2200.00,
      dailyCap: 200.00,
      categoryBreakdown: {
        lodging: 1100.00,
        food: 500.00,
        activities: 200.00,
        transport: 0.00
      }
    },
    stops: []
  },
  {
    id: 'trip-marrakech',
    userId: 'u-101-alex',
    name: 'Marrakech Market',
    subtitle: 'Marrakech Souks & Medina',
    startDate: '2022-11-04',
    endDate: '2022-11-12',
    status: 'past',
    dateLabel: 'Nov 2022',
    isPublic: true,
    shareToken: 'marrakech-market-2022',
    coverPhoto: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80',
    description: 'Vibrant spices, intricate tilework in tranquil riads, and atmospheric evening markets.',
    author: {
      name: 'Alex Explorer',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    budget: {
      totalBudget: 1600.00,
      dailyCap: 180.00,
      categoryBreakdown: {
        lodging: 750.00,
        food: 400.00,
        activities: 300.00,
        transport: 0.00
      }
    },
    stops: []
  },
  {
    id: 'trip-grand-canyon',
    userId: 'u-101-alex',
    name: 'Grand Canyon',
    subtitle: 'Arizona Desert & Rim Trails',
    startDate: '2022-08-15',
    endDate: '2022-08-22',
    status: 'past',
    dateLabel: 'Aug 2022',
    isPublic: true,
    shareToken: 'grand-canyon-2022',
    coverPhoto: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=800&q=80',
    description: 'Magnificent sunsets, panoramic canyon vistas, and hiking along Bright Angel trail.',
    author: {
      name: 'Alex Explorer',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    budget: {
      totalBudget: 1200.00,
      dailyCap: 150.00,
      categoryBreakdown: {
        lodging: 600.00,
        food: 350.00,
        activities: 0.00,
        transport: 0.00
      }
    },
    stops: []
  }
];

export const CATEGORY_COLORS = {
  'Lodging': {
    border: 'border-l-[#4CAF50]',
    badgeBg: 'bg-[#4CAF50]/15',
    badgeText: 'text-[#2E7D32]',
    barColor: 'bg-[#4CAF50]',
    dotColor: '#4CAF50',
    label: 'LODGING'
  },
  'Food & Dining': {
    border: 'border-l-[#FFC107]',
    badgeBg: 'bg-[#FFC107]/20',
    badgeText: 'text-[#B78103]',
    barColor: 'bg-[#FFC107]',
    dotColor: '#FFC107',
    label: 'FOOD'
  },
  'Food': {
    border: 'border-l-[#FFC107]',
    badgeBg: 'bg-[#FFC107]/20',
    badgeText: 'text-[#B78103]',
    barColor: 'bg-[#FFC107]',
    dotColor: '#FFC107',
    label: 'FOOD'
  },
  'Culture & History': {
    border: 'border-l-[#2196F3]',
    badgeBg: 'bg-[#2196F3]/15',
    badgeText: 'text-[#1976D2]',
    barColor: 'bg-[#2196F3]',
    dotColor: '#2196F3',
    label: 'CULTURE'
  },
  'Sightseeing': {
    border: 'border-l-[#00236f]',
    badgeBg: 'bg-[#00236f]/15',
    badgeText: 'text-[#00236f]',
    barColor: 'bg-[#00236f]',
    dotColor: '#00236f',
    label: 'SIGHTSEEING'
  },
  'Leisure': {
    border: 'border-l-[#9C27B0]',
    badgeBg: 'bg-[#9C27B0]/15',
    badgeText: 'text-[#7B1FA2]',
    barColor: 'bg-[#9C27B0]',
    dotColor: '#9C27B0',
    label: 'LEISURE'
  },
  'Adventure': {
    border: 'border-l-[#FF5722]',
    badgeBg: 'bg-[#FF5722]/15',
    badgeText: 'text-[#D84315]',
    barColor: 'bg-[#FF5722]',
    dotColor: '#FF5722',
    label: 'ADVENTURE'
  },
  'Activity': {
    border: 'border-l-[#2196F3]',
    badgeBg: 'bg-[#2196F3]/15',
    badgeText: 'text-[#1976D2]',
    barColor: 'bg-[#2196F3]',
    dotColor: '#2196F3',
    label: 'ACTIVITY'
  }
};
