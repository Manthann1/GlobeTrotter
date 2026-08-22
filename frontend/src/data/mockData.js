// GlobeTrotter Pre-seeded Database & Mock Data (India-Centric & Global)

export const INITIAL_USER = {
  id: 'u-101-aarav',
  name: 'Aarav Sharma',
  location: 'Mumbai, India',
  email: 'aarav.sharma@globetrotter.in',
  profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
  languagePref: 'en-IN',
  currency: 'INR',
  stats: {
    totalTrips: 6,
    upcomingTrips: 3,
    budgetSavings: 38500, // in INR
  }
};

export const CITIES_DATA = [
  // --- INDIAN DESTINATIONS ---
  {
    id: 'c-jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    region: 'North India',
    costIndex: 1.10,
    popularityScore: 4.96,
    tag: 'The Pink City',
    priceLevel: '₹₹₹',
    imageUrl: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?auto=format&fit=crop&w=1200&q=80',
    description: 'The regal capital of Rajasthan renowned for grand hilltop forts, ornate pink sandstone palaces, lively colorful bazaars, and legendary royal cuisine.',
    activities: [
      {
        id: 'act-jpr-1',
        name: 'Heritage Stay at Samode Haveli',
        category: 'Lodging',
        cost: 18500.00,
        durationMins: 60,
        timeSlot: '14:00',
        description: 'Check into a 175-year-old royal townhouse palace with painted archways, lush courtyards, and traditional Rajasthani hospitality.',
        imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-jpr-2',
        name: 'Amber Fort & Sheesh Mahal Guided Tour',
        category: 'Culture & History',
        cost: 1200.00,
        durationMins: 180,
        timeSlot: '09:00',
        description: 'Explore the majestic 16th-century fortress, mirror palace (Sheesh Mahal), and breathtaking Maota Lake views with an expert historian.',
        imageUrl: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-jpr-3',
        name: 'Royal Rajasthani Thali at Chokhi Dhani',
        category: 'Food & Dining',
        cost: 1800.00,
        durationMins: 150,
        timeSlot: '19:30',
        description: 'Feast on authentic Dal Baati Churma, Gatte ki Sabzi, Ker Sangri, and Laal Maas accompanied by live folk dance and puppet shows.',
        imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-jpr-4',
        name: 'Hawa Mahal Sunrise & Johari Bazaar Walk',
        category: 'Sightseeing',
        cost: 450.00,
        durationMins: 120,
        timeSlot: '07:30',
        description: 'Photograph the 953 honeycomb windows of Palace of Winds and shop for hand-blocked textiles, blue pottery, and silver jewelry.',
        imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-jpr-5',
        name: 'Nahargarh Fort Sunset Views',
        category: 'Sightseeing',
        cost: 350.00,
        durationMins: 90,
        timeSlot: '17:30',
        description: 'Watch the sun sink behind the Aravalli hills with panoramic 360-degree twilight views over the glowing Pink City.',
        imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'c-udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    region: 'North India',
    costIndex: 1.20,
    popularityScore: 4.95,
    tag: 'City of Lakes',
    priceLevel: '₹₹₹',
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    description: 'The Venice of the East, surrounded by shimmering Lake Pichola, floating marble palaces, lush Mewar gardens, and romantic sunset ghats.',
    activities: [
      {
        id: 'act-udp-1',
        name: 'Lake Pichola Sunset Boat Cruise',
        category: 'Leisure',
        cost: 1500.00,
        durationMins: 90,
        timeSlot: '17:00',
        description: 'Glide along tranquil waters past Jag Niwas (Lake Palace) and Jag Mandir island under golden twilight skies.',
        imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-udp-2',
        name: 'City Palace Grand Museum & Crystal Gallery',
        category: 'Culture & History',
        cost: 850.00,
        durationMins: 150,
        timeSlot: '10:00',
        description: 'Tour the largest palace complex in Rajasthan featuring Mewar miniature paintings, peacock courtyards, and royal armory.',
        imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-udp-3',
        name: 'Rooftop Candlelight Dinner at Ambrai',
        category: 'Food & Dining',
        cost: 3200.00,
        durationMins: 120,
        timeSlot: '20:00',
        description: 'Dine lakeside overlooking illuminated City Palace with signature Mewari curries and Rajasthani bread.',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-udp-4',
        name: 'Taj Fateh Prakash Palace Stay',
        category: 'Lodging',
        cost: 28000.00,
        durationMins: 60,
        timeSlot: '14:00',
        description: 'Immerse in unmatched regal luxury directly on the eastern shores of Lake Pichola.',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'c-kerala',
    name: 'Alleppey & Munnar',
    state: 'Kerala',
    country: 'India',
    region: 'South India',
    costIndex: 1.05,
    popularityScore: 4.94,
    tag: "God's Own Country",
    priceLevel: '₹₹',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    description: 'Lush emerald tea plantations in misty Western Ghats, coconut palm backwaters, Ayurvedic wellness retreats, and aromatic coastal cuisine.',
    activities: [
      {
        id: 'act-ker-1',
        name: 'Traditional Luxury Houseboat Cruise',
        category: 'Lodging',
        cost: 14500.00,
        durationMins: 720,
        timeSlot: '12:30',
        description: 'Overnight journey on a handcrafted Kettuvallam through Vembanad Lake backwaters with fresh Karimeen Pollichathu dinner.',
        imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-ker-2',
        name: 'Munnar Tea Plantation Trek & Tasting',
        category: 'Adventure',
        cost: 1200.00,
        durationMins: 180,
        timeSlot: '07:00',
        description: 'Walk through rolling green tea estates, visit century-old tea factories, and taste fresh single-origin Cardamom and Nilgiri brews.',
        imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-ker-3',
        name: 'Kathakali & Kalaripayattu Martial Arts Show',
        category: 'Culture & History',
        cost: 650.00,
        durationMins: 120,
        timeSlot: '18:00',
        description: 'Witness ancient Kerala martial arts demonstrations and expressive classical dance dramas with traditional facial makeup.',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'c-goa',
    name: 'Goa',
    state: 'Goa',
    country: 'India',
    region: 'Coastal India',
    costIndex: 1.15,
    popularityScore: 4.92,
    tag: 'Sun, Sand & Seafood',
    priceLevel: '₹₹',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    description: 'Golden beaches, Portuguese heritage churches in Old Goa, lively beach shacks, Dudhsagar falls, and chilled coastal nightlife.',
    activities: [
      {
        id: 'act-goa-1',
        name: 'Heritage Villa Stay in Fontainhas',
        category: 'Lodging',
        cost: 9500.00,
        durationMins: 60,
        timeSlot: '14:00',
        description: 'Stay in colorful Latin Quarter Portuguese heritage mansions in Panjim.',
        imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-goa-2',
        name: 'Scuba Diving & Water Sports at Grand Island',
        category: 'Adventure',
        cost: 3500.00,
        durationMins: 300,
        timeSlot: '08:00',
        description: 'Snorkel and scuba dive alongside coral reefs, dolphin spotting, and BBQ lunch.',
        imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-goa-3',
        name: 'Sunset Beach Shack Seafood Feast',
        category: 'Food & Dining',
        cost: 2200.00,
        durationMins: 120,
        timeSlot: '18:30',
        description: 'Fresh Butter Garlic Prawns, Goan Fish Curry, and Bebinca while watching the Arabian Sea sunset.',
        imageUrl: 'https://images.unsplash.com/photo-1533777857889-4be7c70e33f7?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'c-varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    region: 'North India',
    costIndex: 0.80,
    popularityScore: 4.90,
    tag: 'Spiritual Capital',
    priceLevel: '₹',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    description: 'The eternal holy city on the banks of sacred River Ganga with mystical ghats, evening Aarti ceremonies, and silk weaving heritage.',
    activities: [
      {
        id: 'act-vns-1',
        name: 'Subah-e-Banaras Sunrise Boat Ride',
        category: 'Spiritual',
        cost: 600.00,
        durationMins: 120,
        timeSlot: '05:30',
        description: 'Witness sunrise rituals, morning prayers, and holy bathing along Assi to Manikarnika Ghats.',
        imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-vns-2',
        name: 'Grand Ganga Aarti at Dashashwamedh Ghat',
        category: 'Spiritual',
        cost: 0.00,
        durationMins: 90,
        timeSlot: '18:30',
        description: 'Experience the spectacular choreographed ritual of brass lamps, conch shells, and devotional chants by river priests.',
        imageUrl: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-vns-3',
        name: 'Old Kashi Street Food & Malaiyo Walk',
        category: 'Food & Dining',
        cost: 400.00,
        durationMins: 120,
        timeSlot: '08:30',
        description: 'Taste Kachori Jalebi, Banarasi Paan, Blue Lassi, and saffron Malaiyo foam in narrow historic alleys.',
        imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'c-ladakh',
    name: 'Leh Ladakh',
    state: 'Ladakh',
    country: 'India',
    region: 'Himalayas',
    costIndex: 1.25,
    popularityScore: 4.98,
    tag: 'Land of High Passes',
    priceLevel: '₹₹₹',
    imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    description: 'Dramatic high-altitude Tibetan plateau, azure Pangong Lake, ancient cliffside monasteries, and thrilling motorcycling mountain passes.',
    activities: [
      {
        id: 'act-ldk-1',
        name: 'Pangong Tso Lake Camping & Stargazing',
        category: 'Adventure',
        cost: 6500.00,
        durationMins: 720,
        timeSlot: '15:00',
        description: 'Camp next to the world-famous color-changing lake at 14,270 ft under pristine Milky Way skies.',
        imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-ldk-2',
        name: 'Nubra Valley & Hunder Sand Dunes Safari',
        category: 'Sightseeing',
        cost: 3200.00,
        durationMins: 240,
        timeSlot: '10:00',
        description: 'Cross Khardung La pass (17,982 ft) and ride double-humped Bactrian camels across white desert sand dunes.',
        imageUrl: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-ldk-3',
        name: 'Thiksey & Hemis Monastery Morning Prayers',
        category: 'Culture & History',
        cost: 200.00,
        durationMins: 150,
        timeSlot: '06:00',
        description: 'Listen to deep chanting by Buddhist monks in century-old prayer halls styled after Lhasa Potala Palace.',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'c-manali',
    name: 'Manali & Spiti',
    state: 'Himachal Pradesh',
    country: 'India',
    region: 'Himalayas',
    costIndex: 0.95,
    popularityScore: 4.91,
    tag: 'Valley of the Gods',
    priceLevel: '₹₹',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    description: 'Snow-capped Himalayan peaks, apple orchards, Solang Valley paragliding, and historic wooden temples in Old Manali.',
    activities: [
      {
        id: 'act-mnl-1',
        name: 'Solang Valley Paragliding & Atal Tunnel Drive',
        category: 'Adventure',
        cost: 3200.00,
        durationMins: 240,
        timeSlot: '09:00',
        description: 'Tandem paragliding flight soaring over snow fields and scenic drive through the worlds longest high-altitude tunnel.',
        imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-mnl-2',
        name: 'Old Manali Cafe Crawl & Trout Tasting',
        category: 'Food & Dining',
        cost: 1400.00,
        durationMins: 120,
        timeSlot: '19:00',
        description: 'Enjoy wood-fired pizzas, fresh river trout, apple cider, and live acoustic music.',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'c-mumbai',
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    region: 'West India',
    costIndex: 1.35,
    popularityScore: 4.88,
    tag: 'Maximum City',
    priceLevel: '₹₹₹',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    description: 'Gateway of India, Marine Drive Queen Necklace, Bollywood glamour, heritage art deco architecture, and world-class street cuisine.',
    activities: [
      {
        id: 'act-mum-1',
        name: 'Taj Mahal Palace Heritage High Tea',
        category: 'Food & Dining',
        cost: 3800.00,
        durationMins: 90,
        timeSlot: '16:00',
        description: 'Classic English high tea and Parsi delicacies overlooking Gateway of India and Arabian Sea harbor.',
        imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-mum-2',
        name: 'Elephanta Island Rock-Cut Caves Ferry Tour',
        category: 'Culture & History',
        cost: 850.00,
        durationMins: 240,
        timeSlot: '09:30',
        description: 'UNESCO World Heritage 6th-century rock-cut Shiva sculptures located on an island in Mumbai harbor.',
        imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },

  // --- INTERNATIONAL DESTINATIONS FOR GLOBETROTTERS ---
  {
    id: 'c-paris',
    name: 'Paris',
    state: 'Île-de-France',
    country: 'France',
    region: 'International',
    costIndex: 2.80,
    popularityScore: 4.95,
    tag: 'European Classic',
    priceLevel: '₹₹₹₹',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    description: 'The City of Light with Eiffel Tower, Louvre masterpieces, romantic Seine boat rides, and gourmet French bakeries.',
    activities: [
      {
        id: 'act-paris-1',
        name: 'Eiffel Tower Summit Tour',
        category: 'Sightseeing',
        cost: 3400.00,
        durationMins: 120,
        timeSlot: '11:00',
        description: 'Ascend to the highest platform for views across Paris.',
        imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'act-paris-2',
        name: 'Louvre Museum Tour',
        category: 'Culture & History',
        cost: 4000.00,
        durationMins: 180,
        timeSlot: '09:00',
        description: 'Guided tour of the worlds largest art museum.',
        imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'c-tokyo',
    name: 'Tokyo',
    state: 'Kanto',
    country: 'Japan',
    region: 'International',
    costIndex: 2.50,
    popularityScore: 4.90,
    tag: 'Futuristic Capital',
    priceLevel: '₹₹₹₹',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    description: 'Neon skylines, ancient shrines, bullet trains, and world-class ramen & sushi.',
    activities: [
      {
        id: 'act-tokyo-1',
        name: 'Shibuya Crossing & Harajuku Safari',
        category: 'Sightseeing',
        cost: 1400.00,
        durationMins: 150,
        timeSlot: '14:00',
        description: 'Experience the world-famous scramble intersection and pop culture.',
        imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
];

export const INITIAL_TRIPS = [
  {
    id: 'trip-royal-rajasthan',
    userId: 'u-101-aarav',
    name: 'Royal Rajasthan Heritage Tour',
    subtitle: 'Jaipur & Udaipur',
    startDate: '2024-10-15',
    endDate: '2024-10-25',
    status: 'upcoming',
    isPublic: true,
    shareToken: 'rajasthan-royal-2024',
    coverPhoto: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?auto=format&fit=crop&w=1600&q=85',
    description: 'An unforgettable 10-day royal journey through the magnificent forts, mirror palaces, lake boat cruises, and royal dining of Rajasthan.',
    author: {
      name: 'Aarav Sharma',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    },
    budget: {
      totalBudget: 85000.00, // in INR
      dailyCap: 8500.00,
      categoryBreakdown: {
        lodging: 46500.00,
        food: 12500.00,
        activities: 9500.00,
        transport: 0.00
      }
    },
    stops: [
      {
        id: 'stop-jaipur',
        cityId: 'c-jaipur',
        cityName: 'Jaipur',
        state: 'Rajasthan',
        country: 'India',
        arrivalDate: '2024-10-15',
        departureDate: '2024-10-19',
        sortOrder: 0,
        estCost: 22350.00,
        activities: [
          {
            id: 'ta-j1',
            day: 1,
            dayTitle: 'Day 1: Arrival & Palace Check-in',
            name: 'Heritage Stay at Samode Haveli',
            category: 'Lodging',
            cost: 18500.00,
            timeSlot: '14:00',
            description: 'Check into a 175-year-old royal townhouse palace with painted archways and traditional welcome.',
            imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
            sortOrder: 0
          },
          {
            id: 'ta-j2',
            day: 1,
            dayTitle: 'Day 1: Arrival & Palace Check-in',
            name: 'Royal Rajasthani Thali at Chokhi Dhani',
            category: 'Food & Dining',
            cost: 1800.00,
            timeSlot: '19:30',
            description: 'Feast on authentic Dal Baati Churma, Ker Sangri, and Laal Maas with folk dance.',
            imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
            sortOrder: 1
          },
          {
            id: 'ta-j3',
            day: 2,
            dayTitle: 'Day 2: Fortresses & Bazaars',
            name: 'Amber Fort & Sheesh Mahal Guided Tour',
            category: 'Culture & History',
            cost: 1200.00,
            timeSlot: '09:00',
            description: 'Explore the majestic 16th-century fortress and mirror palace with historian.',
            imageUrl: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?auto=format&fit=crop&w=800&q=80',
            sortOrder: 2
          },
          {
            id: 'ta-j4',
            day: 2,
            dayTitle: 'Day 2: Fortresses & Bazaars',
            name: 'Hawa Mahal Sunrise & Johari Bazaar Walk',
            category: 'Sightseeing',
            cost: 450.00,
            timeSlot: '16:00',
            description: 'Photograph Palace of Winds and shop for hand-blocked textiles and blue pottery.',
            imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
            sortOrder: 3
          }
        ]
      },
      {
        id: 'stop-udaipur',
        cityId: 'c-udaipur',
        cityName: 'Udaipur',
        state: 'Rajasthan',
        country: 'India',
        arrivalDate: '2024-10-20',
        departureDate: '2024-10-25',
        sortOrder: 1,
        estCost: 33550.00,
        activities: [
          {
            id: 'ta-u1',
            day: 3,
            dayTitle: 'Day 3: Lake Pichola & Palaces',
            name: 'Taj Fateh Prakash Palace Stay',
            category: 'Lodging',
            cost: 28000.00,
            timeSlot: '14:00',
            description: 'Regal luxury stay directly overlooking tranquil waters of Lake Pichola.',
            imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
            sortOrder: 0
          },
          {
            id: 'ta-u2',
            day: 3,
            dayTitle: 'Day 3: Lake Pichola & Palaces',
            name: 'Lake Pichola Sunset Boat Cruise',
            category: 'Leisure',
            cost: 1500.00,
            timeSlot: '17:30',
            description: 'Glide past Lake Palace and Jag Mandir island under golden twilight skies.',
            imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
            sortOrder: 1
          },
          {
            id: 'ta-u3',
            day: 4,
            dayTitle: 'Day 4: Mewar Heritage & Fine Dining',
            name: 'City Palace Grand Museum & Crystal Gallery',
            category: 'Culture & History',
            cost: 850.00,
            timeSlot: '10:00',
            description: 'Tour largest palace complex in Rajasthan with Mewar miniature paintings.',
            imageUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
            sortOrder: 2
          },
          {
            id: 'ta-u4',
            day: 4,
            dayTitle: 'Day 4: Mewar Heritage & Fine Dining',
            name: 'Rooftop Candlelight Dinner at Ambrai',
            category: 'Food & Dining',
            cost: 3200.00,
            timeSlot: '20:00',
            description: 'Dine lakeside overlooking illuminated City Palace with signature curries.',
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
            sortOrder: 3
          }
        ]
      }
    ]
  },
  {
    id: 'trip-kerala-backwaters',
    userId: 'u-101-aarav',
    name: 'Kerala Backwaters & Tea Hills',
    subtitle: 'Munnar & Alleppey',
    startDate: '2024-11-10',
    endDate: '2024-11-18',
    status: 'upcoming',
    isPublic: true,
    shareToken: 'kerala-backwaters-2024',
    coverPhoto: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=85',
    description: 'A tranquil 8-day tropical retreat through misty Munnar tea plantations, spices, luxury houseboat stay, and Ayurvedic rejuvenation.',
    author: {
      name: 'Aarav Sharma',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    },
    budget: {
      totalBudget: 55000.00,
      dailyCap: 6500.00,
      categoryBreakdown: {
        lodging: 14500.00,
        food: 1850.00,
        activities: 1850.00,
        transport: 0.00
      }
    },
    stops: [
      {
        id: 'stop-alleppey',
        cityId: 'c-kerala',
        cityName: 'Alleppey & Munnar',
        state: 'Kerala',
        country: 'India',
        arrivalDate: '2024-11-10',
        departureDate: '2024-11-18',
        sortOrder: 0,
        estCost: 16350.00,
        activities: [
          {
            id: 'ta-k1',
            day: 1,
            dayTitle: 'Day 1: Houseboat Backwater Bliss',
            name: 'Traditional Luxury Houseboat Cruise',
            category: 'Lodging',
            cost: 14500.00,
            timeSlot: '12:30',
            description: 'Overnight journey on a handcrafted Kettuvallam with fresh Karimeen dinner.',
            imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
            sortOrder: 0
          },
          {
            id: 'ta-k2',
            day: 2,
            dayTitle: 'Day 2: Western Ghats Tea & Culture',
            name: 'Munnar Tea Plantation Trek & Tasting',
            category: 'Adventure',
            cost: 1200.00,
            timeSlot: '07:00',
            description: 'Walk through green tea estates and sample fresh single-origin brews.',
            imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
            sortOrder: 1
          },
          {
            id: 'ta-k3',
            day: 2,
            dayTitle: 'Day 2: Western Ghats Tea & Culture',
            name: 'Kathakali & Kalaripayattu Martial Arts Show',
            category: 'Culture & History',
            cost: 650.00,
            timeSlot: '18:00',
            description: 'Witness ancient Kerala martial arts demonstrations and classical dance.',
            imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
            sortOrder: 2
          }
        ]
      }
    ]
  },
  {
    id: 'trip-goa-vibes',
    userId: 'u-101-aarav',
    name: 'Goa Coastal Getaway',
    subtitle: 'North & South Goa',
    startDate: '2024-12-20',
    endDate: '2024-12-26',
    status: 'upcoming',
    isPublic: true,
    shareToken: 'goa-coastal-2024',
    coverPhoto: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=85',
    description: 'Sun, sand, water sports, Latin Quarter heritage villas, and beach sunset feasts.',
    author: {
      name: 'Aarav Sharma',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    },
    budget: {
      totalBudget: 45000.00,
      dailyCap: 7500.00,
      categoryBreakdown: {
        lodging: 9500.00,
        food: 2200.00,
        activities: 3500.00,
        transport: 0.00
      }
    },
    stops: [
      {
        id: 'stop-goa',
        cityId: 'c-goa',
        cityName: 'Goa',
        state: 'Goa',
        country: 'India',
        arrivalDate: '2024-12-20',
        departureDate: '2024-12-26',
        sortOrder: 0,
        estCost: 15200.00,
        activities: [
          {
            id: 'ta-g1',
            day: 1,
            dayTitle: 'Day 1: Latin Quarter Arrival',
            name: 'Heritage Villa Stay in Fontainhas',
            category: 'Lodging',
            cost: 9500.00,
            timeSlot: '14:00',
            description: 'Stay in colorful Latin Quarter Portuguese heritage mansions.',
            imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
            sortOrder: 0
          },
          {
            id: 'ta-g2',
            day: 2,
            dayTitle: 'Day 2: Scuba & Beach Shacks',
            name: 'Scuba Diving & Water Sports at Grand Island',
            category: 'Adventure',
            cost: 3500.00,
            timeSlot: '08:00',
            description: 'Snorkel and scuba dive alongside coral reefs and dolphin spotting.',
            imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
            sortOrder: 1
          },
          {
            id: 'ta-g3',
            day: 2,
            dayTitle: 'Day 2: Scuba & Beach Shacks',
            name: 'Sunset Beach Shack Seafood Feast',
            category: 'Food & Dining',
            cost: 2200.00,
            timeSlot: '18:30',
            description: 'Fresh Butter Garlic Prawns and Goan Fish Curry by the sea.',
            imageUrl: 'https://images.unsplash.com/photo-1533777857889-4be7c70e33f7?auto=format&fit=crop&w=800&q=80',
            sortOrder: 2
          }
        ]
      }
    ]
  },
  {
    id: 'trip-varanasi-spiritual',
    userId: 'u-101-aarav',
    name: 'Varanasi Ghats & Ganga Aarti',
    subtitle: 'Varanasi, UP',
    startDate: '2023-11-04',
    endDate: '2023-11-08',
    status: 'past',
    dateLabel: 'Nov 2023',
    isPublic: true,
    shareToken: 'varanasi-spiritual-2023',
    coverPhoto: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
    description: 'Mystical sunrise boat rides on Ganga, evening Aarti ceremonies, and street food.',
    author: {
      name: 'Aarav Sharma',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    },
    budget: {
      totalBudget: 22000.00,
      dailyCap: 4500.00,
      categoryBreakdown: { lodging: 12000.00, food: 3500.00, activities: 2000.00, transport: 0.00 }
    },
    stops: []
  },
  {
    id: 'trip-ladakh-expedition',
    userId: 'u-101-aarav',
    name: 'Leh-Ladakh High Passes',
    subtitle: 'Pangong & Nubra Valley',
    startDate: '2023-06-12',
    endDate: '2023-06-22',
    status: 'past',
    dateLabel: 'June 2023',
    isPublic: true,
    shareToken: 'ladakh-expedition-2023',
    coverPhoto: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    description: 'High-altitude passes, azure Pangong Lake, and cliffside monasteries.',
    author: {
      name: 'Aarav Sharma',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    },
    budget: {
      totalBudget: 65000.00,
      dailyCap: 6500.00,
      categoryBreakdown: { lodging: 28000.00, food: 12000.00, activities: 15000.00, transport: 0.00 }
    },
    stops: []
  },
  {
    id: 'trip-european-summer',
    userId: 'u-101-aarav',
    name: 'European Summer (Paris & Rome)',
    subtitle: 'France & Italy',
    startDate: '2023-05-15',
    endDate: '2023-05-30',
    status: 'past',
    dateLabel: 'May 2023',
    isPublic: true,
    shareToken: 'european-summer-intl',
    coverPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    description: 'An international summer exploration across Paris and Rome.',
    author: {
      name: 'Aarav Sharma',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    },
    budget: {
      totalBudget: 240000.00,
      dailyCap: 16000.00,
      categoryBreakdown: { lodging: 120000.00, food: 50000.00, activities: 45000.00, transport: 0.00 }
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
    label: 'STAY / HAVELI'
  },
  'Food & Dining': {
    border: 'border-l-[#FFC107]',
    badgeBg: 'bg-[#FFC107]/20',
    badgeText: 'text-[#B78103]',
    barColor: 'bg-[#FFC107]',
    dotColor: '#FFC107',
    label: 'FOOD & THALI'
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
    label: 'HERITAGE / FORT'
  },
  'Spiritual': {
    border: 'border-l-[#FF9800]',
    badgeBg: 'bg-[#FF9800]/15',
    badgeText: 'text-[#E65100]',
    barColor: 'bg-[#FF9800]',
    dotColor: '#FF9800',
    label: 'SPIRITUAL / GHAT'
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
    label: 'LEISURE / CRUISE'
  },
  'Adventure': {
    border: 'border-l-[#FF5722]',
    badgeBg: 'bg-[#FF5722]/15',
    badgeText: 'text-[#D84315]',
    barColor: 'bg-[#FF5722]',
    dotColor: '#FF5722',
    label: 'ADVENTURE / TREK'
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
