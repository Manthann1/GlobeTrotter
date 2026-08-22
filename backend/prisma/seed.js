import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CITIES_DATA = [
  {
    name: 'Paris',
    country: 'France',
    costIndex: 1.45,
    popularityScore: 4.95,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Eiffel Tower Summit Tour',
        category: 'Sightseeing',
        cost: 38.00,
        durationMins: 150,
        description: 'Ascend to the summit of the Eiffel Tower for panoramic views across Paris.',
        imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Louvre Museum Masterpieces Guided Walk',
        category: 'Culture & History',
        cost: 45.00,
        durationMins: 180,
        description: 'Explore the Mona Lisa, Venus de Milo, and Winged Victory with an expert art historian.',
        imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Seine River Sunset Dinner Cruise',
        category: 'Food & Dining',
        cost: 85.00,
        durationMins: 120,
        description: 'Enjoy a 3-course French dinner while cruising past illuminated Parisian monuments.',
        imageUrl: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Montmartre & Sacre-Coeur Walking Tour',
        category: 'Sightseeing',
        cost: 20.00,
        durationMins: 120,
        description: 'Stroll through bohemian Montmartre and visit the artists square at Place du Tertre.',
        imageUrl: 'https://images.unsplash.com/photo-1520939817895-060bdef4ad1b?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Croissant & Pastry Baking Masterclass',
        category: 'Food & Dining',
        cost: 65.00,
        durationMins: 180,
        description: 'Learn the artisan techniques of classic French pastry and puff dough with a Parisian baker.',
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Palace of Versailles Day Trip',
        category: 'Culture & History',
        cost: 55.00,
        durationMins: 360,
        description: 'Tour the Hall of Mirrors, Grand Apartments, and magnificent Royal Gardens.',
        imageUrl: 'https://images.unsplash.com/photo-1584646098378-0874589d76b1?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    costIndex: 1.30,
    popularityScore: 4.90,
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Senso-ji Temple & Asakusa Traditional Walk',
        category: 'Culture & History',
        cost: 0.00,
        durationMins: 120,
        description: 'Visit Tokyos oldest Buddhist temple and browse traditional craft shops along Nakamise.',
        imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Shibuya Crossing & Harajuku Pop-Culture Safari',
        category: 'Sightseeing',
        cost: 15.00,
        durationMins: 150,
        description: 'Experience the world-famous scramble crossing and trendy fashion boutiques on Takeshita Street.',
        imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Tsukiji Outer Market Sushi Tasting',
        category: 'Food & Dining',
        cost: 50.00,
        durationMins: 90,
        description: 'Taste world-class fresh sashimi, grilled seafood skewers, and tamagoyaki.',
        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'teamLab Borderless Digital Art Museum',
        category: 'Adventure',
        cost: 32.00,
        durationMins: 150,
        description: 'Immerse yourself in world-renowned interactive 3D digital projection art.',
        imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Shinjuku Golden Gai Izakaya Food Crawl',
        category: 'Nightlife',
        cost: 60.00,
        durationMins: 180,
        description: 'Bar-hop through atmospheric narrow alleys packed with tiny 6-seat izakayas.',
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Rome',
    country: 'Italy',
    costIndex: 1.25,
    popularityScore: 4.92,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Colosseum & Roman Forum VIP Access',
        category: 'Culture & History',
        cost: 40.00,
        durationMins: 180,
        description: 'Step onto the gladiators arena floor and explore the ruins of ancient Rome.',
        imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Vatican Museums & Sistine Chapel Tour',
        category: 'Culture & History',
        cost: 48.00,
        durationMins: 210,
        description: 'Marvel at Michelangelos ceiling frescoes and St. Peters Basilica.',
        imageUrl: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Trastevere Sunset Food & Wine Walk',
        category: 'Food & Dining',
        cost: 55.00,
        durationMins: 150,
        description: 'Sample authentic carbonara, cacio e pepe, supplì, and local Italian wine.',
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Trevi Fountain & Spanish Steps Night Walk',
        category: 'Sightseeing',
        cost: 0.00,
        durationMins: 90,
        description: 'Toss a coin into the Trevi Fountain and relax on the illuminated Spanish Steps.',
        imageUrl: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Handmade Pasta & Gelato Workshop',
        category: 'Food & Dining',
        cost: 70.00,
        durationMins: 180,
        description: 'Cook fresh tagliatelle and ravioli from scratch with a local Roman chef.',
        imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d62810a9?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'New York',
    country: 'United States',
    costIndex: 1.60,
    popularityScore: 4.88,
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Statue of Liberty & Ellis Island Ferry',
        category: 'Sightseeing',
        cost: 30.00,
        durationMins: 240,
        description: 'Visit Americas most iconic landmark and the historic immigration museum.',
        imageUrl: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Central Park Bicycle Tour',
        category: 'Nature',
        cost: 25.00,
        durationMins: 120,
        description: 'Pedal past Bethesda Terrace, Strawberry Fields, and Bow Bridge.',
        imageUrl: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Broadway Musical Evening Show',
        category: 'Culture & History',
        cost: 95.00,
        durationMins: 160,
        description: 'Experience a world-class theatrical performance in the heart of Times Square.',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Summit One Vanderbilt Observation Deck',
        category: 'Sightseeing',
        cost: 46.00,
        durationMins: 90,
        description: 'Multi-sensory immersive glass observation decks overlooking Manhattan skyline.',
        imageUrl: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Chelsea Market & High Line Food Tour',
        category: 'Food & Dining',
        cost: 65.00,
        durationMins: 150,
        description: 'Savor gourmet tacos, lobster rolls, and artisanal desserts along the elevated rail park.',
        imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    costIndex: 1.20,
    popularityScore: 4.87,
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Sagrada Familia Towers & Basilica Tour',
        category: 'Culture & History',
        cost: 36.00,
        durationMins: 120,
        description: 'Marvel at Gaudis architectural masterpiece with fast-track tower access.',
        imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Park Guell Mosaic & Panoramic Walk',
        category: 'Sightseeing',
        cost: 14.00,
        durationMins: 120,
        description: 'Explore the whimsical ceramic wonderland overlooking the Mediterranean Sea.',
        imageUrl: 'https://images.unsplash.com/photo-1564221710304-0b34005b45f4?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Tapas & Sangria Crawl in El Born',
        category: 'Food & Dining',
        cost: 45.00,
        durationMins: 180,
        description: 'Taste Iberian ham, patatas bravas, pimientos de padron, and local vermouth.',
        imageUrl: 'https://images.unsplash.com/photo-1536510233921-8e5043fce771?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Barceloneta Beach Paddleboarding',
        category: 'Adventure',
        cost: 28.00,
        durationMins: 90,
        description: 'Stand-up paddleboard on gentle Mediterranean morning waves.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Gothic Quarter Mystery & Legends Tour',
        category: 'Culture & History',
        cost: 18.00,
        durationMins: 120,
        description: 'Discover Roman ruins and medieval secrets hidden in winding stone alleyways.',
        imageUrl: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    costIndex: 1.15,
    popularityScore: 4.89,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Fushimi Inari 10,000 Torii Gates Hike',
        category: 'Culture & History',
        cost: 0.00,
        durationMins: 180,
        description: 'Climb through thousands of vermillion gates winding up sacred Mount Inari.',
        imageUrl: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Arashiyama Bamboo Grove & Monkey Park',
        category: 'Nature',
        cost: 10.00,
        durationMins: 150,
        description: 'Wander towering green bamboo stalks and view wild macaque monkeys.',
        imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Kinkaku-ji (Golden Pavilion) Visit',
        category: 'Sightseeing',
        cost: 5.00,
        durationMins: 60,
        description: 'Admire the gold leaf-covered Zen Buddhist temple reflected in the mirror pond.',
        imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Traditional Tea Ceremony & Kimono Experience',
        category: 'Culture & History',
        cost: 45.00,
        durationMins: 90,
        description: 'Learn the ritual art of preparing matcha tea inside a historic machiya townhouse.',
        imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Gion Geisha District Evening Walk',
        category: 'Sightseeing',
        cost: 20.00,
        durationMins: 90,
        description: 'Explore lantern-lit streets and tea houses where Geiko and Maiko practice traditional arts.',
        imageUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'London',
    country: 'United Kingdom',
    costIndex: 1.50,
    popularityScore: 4.85,
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Tower of London & Crown Jewels',
        category: 'Culture & History',
        cost: 38.00,
        durationMins: 180,
        description: 'See the Crown Jewels and uncover 1,000 years of royal history and intrigue.',
        imageUrl: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'British Museum Guided Highlights',
        category: 'Culture & History',
        cost: 0.00,
        durationMins: 150,
        description: 'Explore the Rosetta Stone, Parthenon Sculptures, and Egyptian mummies for free.',
        imageUrl: 'https://images.unsplash.com/photo-1574610758891-5b809b6e6e2e?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'London Eye Panoramic Flight',
        category: 'Sightseeing',
        cost: 35.00,
        durationMins: 45,
        description: 'Soar 135 meters above the Thames in a glass observation capsule.',
        imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Borough Market Gourmet Food Tour',
        category: 'Food & Dining',
        cost: 50.00,
        durationMins: 120,
        description: 'Feast on artisanal British cheeses, scotch eggs, oysters, and freshly baked fudge.',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'West End Theatre Night',
        category: 'Culture & History',
        cost: 75.00,
        durationMins: 150,
        description: 'Catch an award-winning musical or play in Covent Garden / Soho.',
        imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    costIndex: 0.70,
    popularityScore: 4.82,
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Grand Palace & Wat Phra Kaew (Emerald Buddha)',
        category: 'Culture & History',
        cost: 15.00,
        durationMins: 180,
        description: 'Admire golden spires and sacred Siamese royal architecture.',
        imageUrl: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Chao Phraya River Longtail Boat Tour',
        category: 'Sightseeing',
        cost: 25.00,
        durationMins: 120,
        description: 'Cruise the historic canals (klongs) and view water-front stilt communities.',
        imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Chinatown (Yaowarat) Midnight Street Food Crawl',
        category: 'Food & Dining',
        cost: 20.00,
        durationMins: 150,
        description: 'Taste Michelin-rated street pad thai, crispy pork belly, and mango sticky rice.',
        imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Traditional Thai Massage at Wat Pho',
        category: 'Relaxation',
        cost: 18.00,
        durationMins: 90,
        description: 'Rejuvenate body and mind at the birthplace of authentic Thai herbal massage.',
        imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Chatuchak Weekend Market Shopping Spree',
        category: 'Shopping',
        cost: 10.00,
        durationMins: 240,
        description: 'Bargain hunt across 15,000 stalls of clothes, vintage items, and handicrafts.',
        imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Cape Town',
    country: 'South Africa',
    costIndex: 0.85,
    popularityScore: 4.80,
    imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Table Mountain Cable Car & Summit Trek',
        category: 'Nature',
        cost: 24.00,
        durationMins: 180,
        description: 'Ride the rotating aerial cableway and take in 360-degree Atlantic views.',
        imageUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Boulders Beach African Penguin Colony',
        category: 'Nature',
        cost: 12.00,
        durationMins: 120,
        description: 'Get up close to adorable wild endangered penguins nesting on sheltered granite beaches.',
        imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Cape Point & Cape of Good Hope Day Excursion',
        category: 'Adventure',
        cost: 45.00,
        durationMins: 360,
        description: 'Drive along Chapman’s Peak to the dramatic southwestern tip of Africa.',
        imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Stellenbosch Wine Estate Tasting Tour',
        category: 'Food & Dining',
        cost: 65.00,
        durationMins: 300,
        description: 'Sample premium Pinotage and Chenin Blanc paired with artisanal chocolates and cheeses.',
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Robben Island Historical Tour',
        category: 'Culture & History',
        cost: 30.00,
        durationMins: 210,
        description: 'Tour Nelson Mandelas prison cell guided by a former political prisoner.',
        imageUrl: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Sydney',
    country: 'Australia',
    costIndex: 1.40,
    popularityScore: 4.86,
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Sydney Opera House Architectural Tour',
        category: 'Culture & History',
        cost: 32.00,
        durationMins: 90,
        description: 'Discover the engineering marvel and drama behind Utzons world-heritage sails.',
        imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Sydney Harbour BridgeClimb',
        category: 'Adventure',
        cost: 180.00,
        durationMins: 210,
        description: 'Scale the steel arches 134m above Sydney Harbour for unmatched vistas.',
        imageUrl: 'https://images.unsplash.com/photo-1524293581917-878a6d017c structure?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Bondi to Coogee Coastal Walk & Swim',
        category: 'Nature',
        cost: 0.00,
        durationMins: 150,
        description: 'A 6km scenic cliff top walk linking Bondi, Tamarama, Bronte, and Coogee beaches.',
        imageUrl: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Manly Ferry Ride & Fish and Chips',
        category: 'Sightseeing',
        cost: 16.00,
        durationMins: 120,
        description: 'Enjoy iconic harbour cruise views on the public ferry followed by fresh beachside seafood.',
        imageUrl: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Blue Mountains Day Trip & Scenic World',
        category: 'Adventure',
        cost: 75.00,
        durationMins: 480,
        description: 'Witness the Three Sisters rock formation, waterfalls, and eucalyptus forests.',
        imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Cairo',
    country: 'Egypt',
    costIndex: 0.65,
    popularityScore: 4.78,
    imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Giza Pyramids & Great Sphinx Private Tour',
        category: 'Culture & History',
        cost: 35.00,
        durationMins: 240,
        description: 'Explore the Great Pyramid of Khufu and camel trek across the Giza plateau.',
        imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Grand Egyptian Museum (GEM) Tour',
        category: 'Culture & History',
        cost: 25.00,
        durationMins: 180,
        description: 'Witness King Tutankhamuns complete treasure collection in the state-of-the-art museum.',
        imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Khan el-Khalili Bazaar Spice & Lantern Hunt',
        category: 'Shopping',
        cost: 10.00,
        durationMins: 150,
        description: 'Bargain for saffron, perfumes, handcrafted brass lamps, and sip mint tea at El Fishawy.',
        imageUrl: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Nile Felucca Sailboat at Sunset',
        category: 'Relaxation',
        cost: 20.00,
        durationMins: 90,
        description: 'Sail quietly along the Nile River in a traditional wooden sailboat.',
        imageUrl: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Authentic Koshary & Egyptian Street Feast',
        category: 'Food & Dining',
        cost: 8.00,
        durationMins: 60,
        description: 'Taste Cairo’s national dish of lentils, rice, macaroni, spicy tomato sauce, and fried onions.',
        imageUrl: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Rio de Janeiro',
    country: 'Brazil',
    costIndex: 0.90,
    popularityScore: 4.81,
    imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Christ the Redeemer & Corcovado Train',
        category: 'Sightseeing',
        cost: 28.00,
        durationMins: 180,
        description: 'Ascend through Tijuca rainforest to the feet of the iconic 30m Art Deco statue.',
        imageUrl: 'https://images.unsplash.com/photo-1599818816947-a9a3b83643b9?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Sugarloaf Mountain Cable Car Sunset',
        category: 'Sightseeing',
        cost: 30.00,
        durationMins: 150,
        description: 'Two-stage glass cable car offering breathtaking views over Guanabara Bay.',
        imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Copacabana & Ipanema Beachfront Experience',
        category: 'Relaxation',
        cost: 15.00,
        durationMins: 180,
        description: 'Sip fresh caipirinhas, play footvolley, and watch sunset at Arpoador rock.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Lapa Steps (Escadaria Selaron) & Samba Club',
        category: 'Nightlife',
        cost: 22.00,
        durationMins: 210,
        description: 'Visit the 215 colorful tile steps followed by live samba rhythms in historic Lapa.',
        imageUrl: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Tijuca National Park Forest Jeep Safari',
        category: 'Adventure',
        cost: 45.00,
        durationMins: 240,
        description: 'Drive through the worlds largest urban rainforest and swim in crystal waterfalls.',
        imageUrl: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    costIndex: 1.55,
    popularityScore: 4.84,
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Burj Khalifa Level 148 Sky Lounge',
        category: 'Sightseeing',
        cost: 95.00,
        durationMins: 90,
        description: 'Stand at 555m on the highest outdoor observation deck in the world.',
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Desert 4x4 Dune Bashing & BBQ Bedouin Camp',
        category: 'Adventure',
        cost: 65.00,
        durationMins: 360,
        description: 'Thrilling red dune driving, sandboarding, camel rides, and belly dance dinner show.',
        imageUrl: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Dubai Mall & Fountain Show Cruise',
        category: 'Sightseeing',
        cost: 20.00,
        durationMins: 60,
        description: 'Ride an abra on Burj Lake during the choreographed water and music fountain spectacle.',
        imageUrl: 'https://images.unsplash.com/photo-1578895101407-74b5c777e4cf?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Old Dubai Gold & Spice Souk Walking Tour',
        category: 'Shopping',
        cost: 15.00,
        durationMins: 120,
        description: 'Cross Dubai Creek on a traditional 1-dirham abra to explore glittering gold alleyways.',
        imageUrl: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Museum of the Future Interactive Entry',
        category: 'Culture & History',
        cost: 42.00,
        durationMins: 120,
        description: 'Journey to the year 2071 inside an architectural marvel shaped as a torus ring.',
        imageUrl: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Amsterdam',
    country: 'Netherlands',
    costIndex: 1.35,
    popularityScore: 4.83,
    imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Van Gogh Museum Masterpieces Tour',
        category: 'Culture & History',
        cost: 24.00,
        durationMins: 150,
        description: 'Explore the worlds largest collection of Vincent van Goghs paintings and letters.',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Canal Ring Electric Boat Cruise with Dutch Cheese',
        category: 'Sightseeing',
        cost: 32.00,
        durationMins: 90,
        description: 'Glide through UNESCO canals with unlimited Gouda cheese and local craft beer.',
        imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Anne Frank House & Jordaan District Walk',
        category: 'Culture & History',
        cost: 18.00,
        durationMins: 120,
        description: 'Visit the secret annex and explore the quaint streets and boutique cafes of Jordaan.',
        imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Zaanse Schans Windmills & Wooden Clog Village',
        category: 'Nature',
        cost: 35.00,
        durationMins: 240,
        description: 'See working 18th-century windmills, artisan cheese farms, and clog shoemakers.',
        imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df57046475a?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Amsterdam City Highlights Bike Tour',
        category: 'Adventure',
        cost: 25.00,
        durationMins: 150,
        description: 'Ride like a local through Vondelpark, Museumplein, and hidden courtyards.',
        imageUrl: 'https://images.unsplash.com/photo-1468818438311-4bab781ab9b8?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    costIndex: 0.60,
    popularityScore: 4.91,
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Ubud Sacred Monkey Forest & Rice Terraces',
        category: 'Nature',
        cost: 12.00,
        durationMins: 240,
        description: 'Encounter friendly macaques and walk through UNESCO Tegalalang emerald rice fields.',
        imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Mount Batur Sunrise Volcano Hike & Breakfast',
        category: 'Adventure',
        cost: 45.00,
        durationMins: 360,
        description: 'Trek up an active volcano in darkness to witness sunrise above cloud inversions.',
        imageUrl: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Uluwatu Cliffside Temple & Kecak Fire Dance',
        category: 'Culture & History',
        cost: 18.00,
        durationMins: 180,
        description: 'Watch rhythmic Balinese chanting and drama set against a dramatic ocean cliff sunset.',
        imageUrl: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Balinese Herbal Spa & Flower Bath',
        category: 'Relaxation',
        cost: 30.00,
        durationMins: 120,
        description: 'Indulge in deep tissue massage, traditional body scrub, and petal-filled warm bath.',
        imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Nusa Penida Manta Ray Snorkeling Trip',
        category: 'Adventure',
        cost: 55.00,
        durationMins: 480,
        description: 'Speedboat to Kelingking T-Rex cliff and swim with giant oceanic manta rays.',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    costIndex: 1.48,
    popularityScore: 4.88,
    imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Gardens by the Bay & Supertree Observatory',
        category: 'Sightseeing',
        cost: 26.00,
        durationMins: 180,
        description: 'Explore the Flower Dome, Cloud Forest waterfall, and futuristic glowing Supertrees.',
        imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Marina Bay Sands SkyPark Observation Deck',
        category: 'Sightseeing',
        cost: 22.00,
        durationMins: 90,
        description: 'Enjoy 360-degree views of Singapore skyline, shipping strait, and Marina Bay.',
        imageUrl: 'https://images.unsplash.com/photo-1506351421178-63b52a2d15c8?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Chinatown & Maxwell Hawker Centre Food Feast',
        category: 'Food & Dining',
        cost: 15.00,
        durationMins: 120,
        description: 'Taste Tian Tian Hainanese chicken rice, char kway teow, and laksa noodles.',
        imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Night Safari Open-Air Tram & Walking Trail',
        category: 'Adventure',
        cost: 38.00,
        durationMins: 180,
        description: 'Observe nocturnal wildlife in naturalistic habitats in the worlds first night zoo.',
        imageUrl: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Sentosa Island Cable Car & Beach Club',
        category: 'Relaxation',
        cost: 30.00,
        durationMins: 240,
        description: 'Take the scenic harbour ropeway to white sand beaches and tropical beach clubs.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Prague',
    country: 'Czech Republic',
    costIndex: 0.95,
    popularityScore: 4.82,
    imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Prague Castle & St. Vitus Cathedral Complex',
        category: 'Culture & History',
        cost: 16.00,
        durationMins: 180,
        description: 'Explore the ancient seat of Bohemian kings with gothic spires and Golden Lane.',
        imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Charles Bridge & Old Town Astronomical Clock',
        category: 'Sightseeing',
        cost: 0.00,
        durationMins: 90,
        description: 'Cross the 14th-century cobblestone bridge lined with 30 baroque saint statues.',
        imageUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Bohemian Beer Tasting & Goulash Feast',
        category: 'Food & Dining',
        cost: 32.00,
        durationMins: 150,
        description: 'Sample world-famous Pilsner Urquell paired with beef goulash and bread dumplings.',
        imageUrl: 'https://images.unsplash.com/photo-1538488881522-4326c36460f7?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Vltava River Panoramic Wooden Boat Tour',
        category: 'Sightseeing',
        cost: 20.00,
        durationMins: 60,
        description: 'Cruise past Prague Castle and beneath historic bridge arches with live commentary.',
        imageUrl: 'https://images.unsplash.com/photo-1520645521318-f03a712f0e67?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Classical Music Concert in Klementinum Chapel',
        category: 'Culture & History',
        cost: 28.00,
        durationMins: 75,
        description: 'Enjoy Vivaldi and Mozart performed in a breathtaking baroque hall with pipe organ.',
        imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Florence',
    country: 'Italy',
    costIndex: 1.20,
    popularityScore: 4.87,
    imageUrl: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Uffizi Gallery Renaissance Masterpieces Tour',
        category: 'Culture & History',
        cost: 32.00,
        durationMins: 150,
        description: 'Stand in awe before Botticellis Birth of Venus and works by Leonardo and Michelangelo.',
        imageUrl: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Brunelleschis Duomo Dome Climb',
        category: 'Sightseeing',
        cost: 30.00,
        durationMins: 120,
        description: 'Climb 463 stone steps between the double shell of the worlds greatest masonry dome.',
        imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Chianti Hills Wine & Olive Oil Safari',
        category: 'Food & Dining',
        cost: 68.00,
        durationMins: 300,
        description: 'Tour Tuscan vineyards and sample Chianti Classico with freshly baked focaccia.',
        imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Ponte Vecchio & Piazzale Michelangelo Sunset',
        category: 'Sightseeing',
        cost: 0.00,
        durationMins: 90,
        description: 'Watch the sun sink over Florence and the Arno River from the iconic scenic terrace.',
        imageUrl: 'https://images.unsplash.com/photo-1520645521318-f03a712f0e67?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Artisan Leather Workshop Tour',
        category: 'Shopping',
        cost: 15.00,
        durationMins: 90,
        description: 'Witness master craftsmen crafting handmade Florentine leather goods in Santa Croce.',
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'San Francisco',
    country: 'United States',
    costIndex: 1.55,
    popularityScore: 4.80,
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Alcatraz Island Cellhouse Audio Tour',
        category: 'Culture & History',
        cost: 45.00,
        durationMins: 180,
        description: 'Ferry across the bay to explore the notorious former federal maximum-security prison.',
        imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Golden Gate Bridge Bike Ride to Sausalito',
        category: 'Adventure',
        cost: 32.00,
        durationMins: 210,
        description: 'Cycle across the majestic orange suspension bridge and take the ferry back.',
        imageUrl: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Fishermans Wharf Clam Chowder & Sea Lions',
        category: 'Food & Dining',
        cost: 22.00,
        durationMins: 90,
        description: 'Enjoy steaming clam chowder in a sourdough bread bowl at historic Pier 39.',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Historic Cable Car Ride & Lombard Street Walk',
        category: 'Sightseeing',
        cost: 8.00,
        durationMins: 90,
        description: 'Hang on the outside running board of a cable car down Californias crookedest street.',
        imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Muir Woods Giant Redwood Forest Expedition',
        category: 'Nature',
        cost: 55.00,
        durationMins: 300,
        description: 'Walk in the serene shade of ancient thousand-year-old coastal redwood trees.',
        imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    name: 'Istanbul',
    country: 'Turkey',
    costIndex: 0.80,
    popularityScore: 4.86,
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80',
    activities: [
      {
        name: 'Hagia Sophia & Blue Mosque Guided Tour',
        category: 'Culture & History',
        cost: 25.00,
        durationMins: 150,
        description: 'Discover 1,500 years of Byzantine and Ottoman history and dazzling blue Iznik tiles.',
        imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Grand Bazaar & Spice Market Shopping Exploration',
        category: 'Shopping',
        cost: 10.00,
        durationMins: 180,
        description: 'Navigate 4,000 shops selling Turkish rugs, ceramics, baklava, and Turkish delight.',
        imageUrl: 'https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Bosphorus Sunset Yacht Cruise with Turkish Meze',
        category: 'Sightseeing',
        cost: 38.00,
        durationMins: 120,
        description: 'Cruise between Europe and Asia past illuminated palaces and seaside mansions.',
        imageUrl: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Traditional Turkish Hamam Bath & Massage',
        category: 'Relaxation',
        cost: 45.00,
        durationMins: 90,
        description: 'Relax on heated marble in a 500-year-old Ottoman bath with foam scrub massage.',
        imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Karakoy & Kadikoy Street Food Safari',
        category: 'Food & Dining',
        cost: 22.00,
        durationMins: 180,
        description: 'Taste balik ekmek (mackerel sandwich), doner kebab, midye dolma, and strong Turkish coffee.',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
];

async function main() {
  console.log('🚀 Starting GlobeTrotter database seeding...');

  // Clean existing tables in order
  console.log('🧹 Cleaning previous seed data...');
  await prisma.sharedLink.deleteMany({});
  await prisma.budget.deleteMany({});
  await prisma.tripActivity.deleteMany({});
  await prisma.stop.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.city.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Demo User
  console.log('👤 Creating demo user...');
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const demoUser = await prisma.user.create({
    data: {
      name: 'Manthan & Team',
      email: 'demo@globetrotter.com',
      passwordHash: passwordHash,
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      languagePref: 'en'
    }
  });
  console.log(`✅ Demo user created: ${demoUser.email} (ID: ${demoUser.id})`);

  // 2. Seed Cities & Activities
  console.log(`🏙️  Seeding ${CITIES_DATA.length} global cities and their activity catalogs...`);
  const createdCities = [];
  const cityActivityMap = new Map();

  for (const cityData of CITIES_DATA) {
    const { activities, ...cityFields } = cityData;
    const city = await prisma.city.create({
      data: cityFields
    });
    createdCities.push(city);

    const createdActivities = [];
    for (const act of activities) {
      const activity = await prisma.activity.create({
        data: {
          ...act,
          cityId: city.id
        }
      });
      createdActivities.push(activity);
    }
    cityActivityMap.set(city.name, createdActivities);
  }
  console.log(`✅ Created ${createdCities.length} cities and seeded all activities.`);

  // 3. Create Sample Demo Trip (European Grand Tour)
  console.log('🗺️ Creating sample multi-city itinerary (Paris -> Florence -> Rome)...');
  const parisCity = createdCities.find(c => c.name === 'Paris');
  const florenceCity = createdCities.find(c => c.name === 'Florence');
  const romeCity = createdCities.find(c => c.name === 'Rome');

  const demoTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      name: 'European Grand Highlights 2026',
      description: 'A two-week adventure spanning Paris monuments, Tuscan vineyards, and ancient Roman history.',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-09-14'),
      coverPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      isPublic: true,
      shareToken: 'euro-tour-2026-demo'
    }
  });

  // 4. Create Trip Budget
  const tripBudget = await prisma.budget.create({
    data: {
      tripId: demoTrip.id,
      dailyCap: 250.00,
      categoryCaps: {
        "Sightseeing": 400.00,
        "Food & Dining": 600.00,
        "Culture & History": 350.00,
        "Adventure": 200.00,
        "Shopping": 200.00,
        "Relaxation": 150.00
      }
    }
  });

  // 5. Create Stops & Snapshotted Trip Activities
  // Stop 1: Paris
  const stop1 = await prisma.stop.create({
    data: {
      tripId: demoTrip.id,
      cityId: parisCity.id,
      arrivalDate: new Date('2026-09-01'),
      departureDate: new Date('2026-09-05'),
      sortOrder: 0
    }
  });

  const parisActs = cityActivityMap.get('Paris') || [];
  if (parisActs.length >= 3) {
    await prisma.tripActivity.createMany({
      data: [
        {
          stopId: stop1.id,
          activityId: parisActs[0].id,
          nameSnapshot: parisActs[0].name,
          costSnapshot: parisActs[0].cost,
          categorySnapshot: parisActs[0].category,
          scheduledDate: new Date('2026-09-01'),
          timeSlot: '10:00 AM - 12:30 PM',
          sortOrder: 0
        },
        {
          stopId: stop1.id,
          activityId: parisActs[1].id,
          nameSnapshot: parisActs[1].name,
          costSnapshot: parisActs[1].cost,
          categorySnapshot: parisActs[1].category,
          scheduledDate: new Date('2026-09-02'),
          timeSlot: '02:00 PM - 05:00 PM',
          sortOrder: 1
        },
        {
          stopId: stop1.id,
          activityId: parisActs[2].id,
          nameSnapshot: parisActs[2].name,
          costSnapshot: parisActs[2].cost,
          categorySnapshot: parisActs[2].category,
          scheduledDate: new Date('2026-09-03'),
          timeSlot: '07:30 PM - 09:30 PM',
          sortOrder: 2
        }
      ]
    });
  }

  // Stop 2: Florence
  const stop2 = await prisma.stop.create({
    data: {
      tripId: demoTrip.id,
      cityId: florenceCity.id,
      arrivalDate: new Date('2026-09-05'),
      departureDate: new Date('2026-09-09'),
      sortOrder: 1
    }
  });

  const florenceActs = cityActivityMap.get('Florence') || [];
  if (florenceActs.length >= 2) {
    await prisma.tripActivity.createMany({
      data: [
        {
          stopId: stop2.id,
          activityId: florenceActs[0].id,
          nameSnapshot: florenceActs[0].name,
          costSnapshot: florenceActs[0].cost,
          categorySnapshot: florenceActs[0].category,
          scheduledDate: new Date('2026-09-06'),
          timeSlot: '09:30 AM - 12:00 PM',
          sortOrder: 0
        },
        {
          stopId: stop2.id,
          activityId: florenceActs[2].id,
          nameSnapshot: florenceActs[2].name,
          costSnapshot: florenceActs[2].cost,
          categorySnapshot: florenceActs[2].category,
          scheduledDate: new Date('2026-09-07'),
          timeSlot: '01:00 PM - 06:00 PM',
          sortOrder: 1
        }
      ]
    });
  }

  // Stop 3: Rome
  const stop3 = await prisma.stop.create({
    data: {
      tripId: demoTrip.id,
      cityId: romeCity.id,
      arrivalDate: new Date('2026-09-09'),
      departureDate: new Date('2026-09-14'),
      sortOrder: 2
    }
  });

  const romeActs = cityActivityMap.get('Rome') || [];
  if (romeActs.length >= 3) {
    await prisma.tripActivity.createMany({
      data: [
        {
          stopId: stop3.id,
          activityId: romeActs[0].id,
          nameSnapshot: romeActs[0].name,
          costSnapshot: romeActs[0].cost,
          categorySnapshot: romeActs[0].category,
          scheduledDate: new Date('2026-09-10'),
          timeSlot: '09:00 AM - 12:00 PM',
          sortOrder: 0
        },
        {
          stopId: stop3.id,
          activityId: romeActs[1].id,
          nameSnapshot: romeActs[1].name,
          costSnapshot: romeActs[1].cost,
          categorySnapshot: romeActs[1].category,
          scheduledDate: new Date('2026-09-11'),
          timeSlot: '01:30 PM - 05:00 PM',
          sortOrder: 1
        },
        {
          stopId: stop3.id,
          activityId: romeActs[2].id,
          nameSnapshot: romeActs[2].name,
          costSnapshot: romeActs[2].cost,
          categorySnapshot: romeActs[2].category,
          scheduledDate: new Date('2026-09-12'),
          timeSlot: '06:00 PM - 08:30 PM',
          sortOrder: 2
        }
      ]
    });
  }

  // 6. Create Shared Link
  const sharedLink = await prisma.sharedLink.create({
    data: {
      tripId: demoTrip.id,
      shareToken: demoTrip.shareToken,
      viewCount: 14
    }
  });

  console.log(`✅ Sample trip created with ${3} stops, budget, snapshotted activities, and public share token: '${demoTrip.shareToken}'`);
  console.log('🎉 Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
