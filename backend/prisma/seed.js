import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────
// CITIES & ACTIVITIES DATA (10 Indian + 5 International)
// ─────────────────────────────────────────────────────────────

const CITIES_DATA = [
  // ═══════════ INDIAN CITIES ═══════════
  {
    name: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    region: 'North India',
    description: 'The Pink City — a vibrant capital of Rajasthan known for grand forts, ornate palaces, and bustling bazaars.',
    costIndex: 0.65,
    popularityScore: 4.85,
    latitude: 26.9124,
    longitude: 75.7873,
    currency: 'INR',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg/960px-East_facade_Hawa_Mahal_Jaipur_from_ground_level_%28July_2022%29_-_img_01.jpg',
    activities: [
      { name: 'Amber Fort & Sheesh Mahal VIP Tour', category: 'Culture & History', cost: 1200, durationMins: 180, description: 'Explore the magnificent Amber Fort complex including the dazzling mirror-work Sheesh Mahal with a private guide.', imageUrl: 'https://picsum.photos/id/11/800/600', rating: 4.90, tags: ['fort', 'heritage', 'guided-tour'] },
      { name: 'Hawa Mahal Sunrise Photography Walk', category: 'Sightseeing', cost: 500, durationMins: 90, description: 'Capture the iconic Palace of Winds at golden hour with a local photography guide through the old city lanes.', imageUrl: 'https://picsum.photos/id/12/800/600', rating: 4.70, tags: ['photography', 'sunrise', 'walking-tour'] },
      { name: 'Chokhi Dhani Royal Rajasthani Thali', category: 'Food & Dining', cost: 1800, durationMins: 150, description: 'Authentic 56-item Rajasthani thali with live folk dance, puppet shows, and camel rides at this cultural village.', imageUrl: 'https://picsum.photos/id/13/800/600', rating: 4.80, tags: ['thali', 'folk-culture', 'dinner'] },
      { name: 'City Palace & Museum Complex', category: 'Culture & History', cost: 700, durationMins: 120, description: 'Tour the royal City Palace complex housing the Maharaja Sawai Man Singh II Museum with textiles, arms, and art.', imageUrl: 'https://picsum.photos/id/14/800/600', rating: 4.65, tags: ['palace', 'museum', 'royalty'] },
      { name: 'Nahargarh Fort Sunset & Jaipur Panorama', category: 'Sightseeing', cost: 350, durationMins: 120, description: 'Watch the sunset over the Pink City from the ramparts of Nahargarh Fort perched on the Aravalli hills.', imageUrl: 'https://picsum.photos/id/15/800/600', rating: 4.75, tags: ['sunset', 'panorama', 'fort'] },
      { name: 'Johari Bazaar Gemstone & Textile Walk', category: 'Leisure', cost: 200, durationMins: 120, description: 'Guided walk through the famous jewellery and textile bazaar — learn about Kundan, Meenakari, and block printing.', imageUrl: 'https://picsum.photos/id/16/800/600', rating: 4.50, tags: ['shopping', 'bazaar', 'crafts'] },
      { name: 'Samode Haveli Heritage Stay', category: 'Lodging', cost: 8500, durationMins: 1440, description: 'Overnight stay in a 175-year-old restored haveli with courtyard pool, Sheesh Mahal dining, and rooftop yoga.', imageUrl: 'https://picsum.photos/id/17/800/600', rating: 4.95, tags: ['haveli', 'heritage-stay', 'luxury'] },
    ]
  },
  {
    name: 'Udaipur',
    state: 'Rajasthan',
    country: 'India',
    region: 'North India',
    description: 'City of Lakes — a romantic royal city with floating palaces, serene lakes, and Mewar heritage.',
    costIndex: 0.70,
    popularityScore: 4.80,
    latitude: 24.5854,
    longitude: 73.7125,
    currency: 'INR',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Evening_view%2C_City_Palace%2C_Udaipur.jpg/960px-Evening_view%2C_City_Palace%2C_Udaipur.jpg',
    activities: [
      { name: 'Lake Pichola Sunset Boat Cruise', category: 'Leisure', cost: 900, durationMins: 90, description: 'Cruise past the Jag Mandir and Taj Lake Palace on shimmering Lake Pichola as the sun sets behind the Aravallis.', imageUrl: 'https://picsum.photos/id/19/800/600', rating: 4.85, tags: ['boat-cruise', 'sunset', 'lake'] },
      { name: 'City Palace & Crystal Gallery Tour', category: 'Culture & History', cost: 600, durationMins: 150, description: 'Explore the sprawling City Palace complex and the rare Crystal Gallery with Bohemian crystal furniture and jewels.', imageUrl: 'https://picsum.photos/id/20/800/600', rating: 4.75, tags: ['palace', 'museum', 'crystal'] },
      { name: 'Ambrai Lakeside Fine Dining', category: 'Food & Dining', cost: 2500, durationMins: 120, description: 'Dine on Rajasthani and continental cuisine at one of India\'s most scenic restaurants overlooking Lake Pichola and the City Palace.', imageUrl: 'https://picsum.photos/id/21/800/600', rating: 4.80, tags: ['lakeside', 'fine-dining', 'romantic'] },
      { name: 'Taj Fateh Prakash Palace Stay', category: 'Lodging', cost: 28000, durationMins: 1440, description: 'Grand heritage palace hotel on the shores of Lake Pichola with royal suites, butler service, and private Darbar Hall dining.', imageUrl: 'https://picsum.photos/id/22/800/600', rating: 4.95, tags: ['palace-hotel', 'luxury', 'heritage'] },
      { name: 'Kumbalgarh Fort & Ranakpur Jain Temple Day Trip', category: 'Culture & History', cost: 1500, durationMins: 480, description: 'Visit the massive Kumbalgarh Fort with the second-longest wall in the world, and the intricately carved Ranakpur Jain Temple.', imageUrl: 'https://picsum.photos/id/23/800/600', rating: 4.70, tags: ['fort', 'temple', 'day-trip'] },
      { name: 'Bagore Ki Haveli Folk Dance Show', category: 'Culture & History', cost: 250, durationMins: 75, description: 'Nightly Rajasthani folk dance performance at the restored 18th-century Bagore Ki Haveli on Gangaur Ghat.', imageUrl: 'https://picsum.photos/id/24/800/600', rating: 4.60, tags: ['folk-dance', 'evening-show', 'culture'] },
    ]
  },
  {
    name: 'Goa',
    state: 'Goa',
    country: 'India',
    region: 'Coastal India',
    description: 'India\'s beach paradise — golden sands, Portuguese heritage, vibrant nightlife, and fresh seafood.',
    costIndex: 0.75,
    popularityScore: 4.75,
    latitude: 15.2993,
    longitude: 74.1240,
    currency: 'INR',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/BeachFun.jpg/960px-BeachFun.jpg',
    activities: [
      { name: 'Grand Island Scuba Diving Adventure', category: 'Adventure', cost: 3500, durationMins: 240, description: 'Dive into the Arabian Sea to explore coral reefs, tropical fish, and an underwater shipwreck at Grand Island.', imageUrl: 'https://picsum.photos/id/26/800/600', rating: 4.70, tags: ['scuba', 'ocean', 'adventure'] },
      { name: 'Fontainhas Latin Quarter Heritage Walk', category: 'Culture & History', cost: 400, durationMins: 120, description: 'Stroll through the colourful Portuguese-era Latin Quarter with tile-roofed houses, churches, and art galleries.', imageUrl: 'https://picsum.photos/id/27/800/600', rating: 4.55, tags: ['heritage', 'walking-tour', 'portuguese'] },
      { name: 'Beach Shack Goan Seafood Feast', category: 'Food & Dining', cost: 1200, durationMins: 120, description: 'Feast on prawn balchão, fish recheado, and Goan feni at a beachside bamboo shack on Palolem or Agonda beach.', imageUrl: 'https://picsum.photos/id/28/800/600', rating: 4.75, tags: ['seafood', 'beach', 'local-cuisine'] },
      { name: 'Dudhsagar Waterfall Jeep Safari', category: 'Adventure', cost: 2800, durationMins: 360, description: 'Off-road jeep safari through the Western Ghats to the magnificent 310-meter Dudhsagar Falls and a forest swim.', imageUrl: 'https://picsum.photos/id/29/800/600', rating: 4.80, tags: ['waterfall', 'safari', 'nature'] },
      { name: 'Basilica of Bom Jesus & Old Goa Churches', category: 'Spiritual', cost: 0, durationMins: 120, description: 'Visit the UNESCO World Heritage Basilica housing the relics of St. Francis Xavier and other 16th-century churches.', imageUrl: 'https://picsum.photos/id/30/800/600', rating: 4.60, tags: ['church', 'UNESCO', 'heritage'] },
      { name: 'Palolem Beach Kayaking & Dolphin Spotting', category: 'Leisure', cost: 800, durationMins: 90, description: 'Paddle along the crescent-shaped Palolem beach at dawn with chances to spot Indo-Pacific dolphins in the bay.', imageUrl: 'https://picsum.photos/id/31/800/600', rating: 4.65, tags: ['kayaking', 'dolphins', 'beach'] },
      { name: 'Latin Quarter Heritage Villa Stay', category: 'Lodging', cost: 5500, durationMins: 1440, description: 'Stay in a restored Portuguese villa in Fontainhas with azulejo tiles, courtyard garden, and traditional Goan breakfast.', imageUrl: 'https://picsum.photos/id/32/800/600', rating: 4.70, tags: ['heritage-villa', 'boutique', 'portuguese'] },
    ]
  },
  {
    name: 'Alleppey',
    state: 'Kerala',
    country: 'India',
    region: 'South India',
    description: 'Venice of the East — a dreamy network of backwaters, houseboats, paddy fields, and coconut palms in Kerala.',
    costIndex: 0.60,
    popularityScore: 4.70,
    latitude: 9.4981,
    longitude: 76.3388,
    currency: 'INR',
    imageUrl: 'https://picsum.photos/id/33/800/600',
    activities: [
      { name: 'Overnight Luxury Kettuvallam Houseboat Cruise', category: 'Leisure', cost: 12000, durationMins: 1440, description: 'Drift through the palm-fringed canals of Vembanad Lake in a premium 2-bedroom houseboat with onboard chef and sundeck.', imageUrl: 'https://picsum.photos/id/34/800/600', rating: 4.90, tags: ['houseboat', 'backwaters', 'luxury'] },
      { name: 'Munnar Tea Estate Walk & Factory Tour', category: 'Sightseeing', cost: 600, durationMins: 180, description: 'Walk through rolling tea plantations in Munnar, visit a working factory, and taste fresh estate-grown varieties.', imageUrl: 'https://picsum.photos/id/35/800/600', rating: 4.75, tags: ['tea', 'plantation', 'munnar'] },
      { name: 'Kathakali Classical Dance & Kalaripayattu Show', category: 'Culture & History', cost: 500, durationMins: 120, description: 'Watch the spectacular Kathakali makeup ceremony, dance performance, and a thrilling Kalaripayattu martial arts demonstration.', imageUrl: 'https://picsum.photos/id/36/800/600', rating: 4.70, tags: ['kathakali', 'martial-arts', 'performance'] },
      { name: 'Kerala Sadya Banana-Leaf Feast', category: 'Food & Dining', cost: 450, durationMins: 90, description: 'Traditional 28-course vegetarian feast served on a banana leaf — avial, olan, payasam, and more.', imageUrl: 'https://picsum.photos/id/37/800/600', rating: 4.80, tags: ['sadya', 'vegetarian', 'traditional'] },
      { name: 'Periyar Wildlife Sanctuary Bamboo Rafting', category: 'Adventure', cost: 1500, durationMins: 240, description: 'Bamboo raft through the Periyar Tiger Reserve spotting wild elephants, gaur, and Nilgiri langurs.', imageUrl: 'https://picsum.photos/id/38/800/600', rating: 4.65, tags: ['wildlife', 'rafting', 'nature'] },
      { name: 'Ayurvedic Spa & Panchakarma Retreat', category: 'Leisure', cost: 3500, durationMins: 180, description: 'Traditional Kerala Ayurvedic massage, Shirodhara oil therapy, and herbal steam bath at a waterside retreat.', imageUrl: 'https://picsum.photos/id/39/800/600', rating: 4.85, tags: ['ayurveda', 'spa', 'wellness'] },
    ]
  },
  {
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    region: 'North India',
    description: 'The spiritual capital of India — ancient ghats, Ganga Aarti, temple lanes, and 5,000 years of living history.',
    costIndex: 0.45,
    popularityScore: 4.65,
    latitude: 25.3176,
    longitude: 83.0068,
    currency: 'INR',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Varanasi%2C_India%2C_Ghats%2C_Cremation_ceremony_in_progress.jpg/960px-Varanasi%2C_India%2C_Ghats%2C_Cremation_ceremony_in_progress.jpg',
    activities: [
      { name: 'Subah-e-Banaras Sunrise Boat Ride', category: 'Spiritual', cost: 600, durationMins: 90, description: 'Witness the magical sunrise over the Ganges from a rowboat — watch morning rituals, yoga, and cremation ghats.', imageUrl: 'https://picsum.photos/id/41/800/600', rating: 4.90, tags: ['sunrise', 'boat-ride', 'spiritual'] },
      { name: 'Dashashwamedh Ghat Grand Ganga Aarti', category: 'Spiritual', cost: 0, durationMins: 60, description: 'Experience the spectacular evening fire-and-chant ceremony performed by priests on the main ghat — an unforgettable ritual.', imageUrl: 'https://picsum.photos/id/42/800/600', rating: 4.95, tags: ['ganga-aarti', 'evening', 'ceremony'] },
      { name: 'Kashi Vishwanath Temple & Gali Tour', category: 'Spiritual', cost: 300, durationMins: 120, description: 'Navigate the narrow temple lanes of old Kashi to the revered Vishwanath Temple with a local pandit guide.', imageUrl: 'https://picsum.photos/id/43/800/600', rating: 4.70, tags: ['temple', 'guided-tour', 'old-city'] },
      { name: 'Banarasi Chaat & Street Food Trail', category: 'Food & Dining', cost: 350, durationMins: 120, description: 'Taste legendary kachori-sabzi, tamatar chaat, thandai, and malaiyo at the iconic street food stalls of Varanasi.', imageUrl: 'https://picsum.photos/id/44/800/600', rating: 4.80, tags: ['street-food', 'chaat', 'food-walk'] },
      { name: 'Sarnath Buddhist Heritage Excursion', category: 'Culture & History', cost: 400, durationMins: 180, description: 'Visit Sarnath where Buddha gave his first sermon — see the Dhamek Stupa, Ashoka Pillar, and archaeological museum.', imageUrl: 'https://picsum.photos/id/45/800/600', rating: 4.60, tags: ['buddhism', 'stupa', 'heritage'] },
      { name: 'Banarasi Silk Weaving Workshop', category: 'Culture & History', cost: 800, durationMins: 120, description: 'Visit a family-run silk workshop to see the painstaking hand-loom process of creating a Banarasi silk sari.', imageUrl: 'https://picsum.photos/id/46/800/600', rating: 4.55, tags: ['silk', 'weaving', 'crafts'] },
    ]
  },
  {
    name: 'Leh',
    state: 'Ladakh',
    country: 'India',
    region: 'Himalayas',
    description: 'Land of High Passes — stark Himalayan beauty, ancient monasteries, high-altitude lakes, and thrilling road trips.',
    costIndex: 0.80,
    popularityScore: 4.70,
    latitude: 34.1526,
    longitude: 77.5771,
    currency: 'INR',
    imageUrl: 'https://picsum.photos/id/47/800/600',
    activities: [
      { name: 'Pangong Tso Lake Overnight Camping', category: 'Adventure', cost: 4500, durationMins: 1440, description: 'Drive the breathtaking Changla Pass to the surreal blue Pangong Lake and camp under a canopy of Milky Way stars.', imageUrl: 'https://picsum.photos/id/48/800/600', rating: 4.90, tags: ['lake', 'camping', 'stargazing'] },
      { name: 'Nubra Valley & Diskit Monastery', category: 'Culture & History', cost: 3500, durationMins: 720, description: 'Cross the world\'s highest motorable pass Khardung La to explore the sand dunes and 32-meter Maitreya Buddha of Nubra.', imageUrl: 'https://picsum.photos/id/49/800/600', rating: 4.85, tags: ['monastery', 'khardung-la', 'desert'] },
      { name: 'Khardung La Pass & Magnetic Hill Drive', category: 'Adventure', cost: 2000, durationMins: 360, description: 'Ride or drive to the legendary Khardung La (5,359m) and experience the optical illusion of Magnetic Hill.', imageUrl: 'https://picsum.photos/id/50/800/600', rating: 4.75, tags: ['high-pass', 'road-trip', 'motorcycle'] },
      { name: 'Thiksey & Hemis Monastery Tour', category: 'Spiritual', cost: 500, durationMins: 240, description: 'Visit the "Little Potala" Thiksey Monastery for morning prayers and the ancient Hemis Monastery with its sacred murals.', imageUrl: 'https://picsum.photos/id/51/800/600', rating: 4.70, tags: ['monastery', 'buddhism', 'morning-prayers'] },
      { name: 'Ladakhi Thukpa & Momos Home Dining', category: 'Food & Dining', cost: 500, durationMins: 90, description: 'Home-cooked Ladakhi meal — steaming thukpa noodle soup, butter tea, and hand-rolled momos with a local family.', imageUrl: 'https://picsum.photos/id/52/800/600', rating: 4.65, tags: ['home-dining', 'local-cuisine', 'momos'] },
      { name: 'Zanskar River Rafting', category: 'Adventure', cost: 3000, durationMins: 300, description: 'White-water rafting through the dramatic Zanskar Gorge — Grade III-IV rapids with towering canyon walls.', imageUrl: 'https://picsum.photos/id/53/800/600', rating: 4.80, tags: ['rafting', 'white-water', 'canyon'] },
    ]
  },
  {
    name: 'Manali',
    state: 'Himachal Pradesh',
    country: 'India',
    region: 'Himalayas',
    description: 'Valley of the Gods — lush valleys, snow-capped peaks, ancient temples, and the gateway to Spiti and Rohtang.',
    costIndex: 0.55,
    popularityScore: 4.60,
    latitude: 32.2396,
    longitude: 77.1887,
    currency: 'INR',
    imageUrl: 'https://picsum.photos/id/54/800/600',
    activities: [
      { name: 'Rohtang Pass Snow Adventure', category: 'Adventure', cost: 2500, durationMins: 360, description: 'Drive to Rohtang Pass (3,978m) for snowfall views, paragliding, and snowmobile rides amidst the Greater Himalayas.', imageUrl: 'https://picsum.photos/id/55/800/600', rating: 4.70, tags: ['snow', 'paragliding', 'high-pass'] },
      { name: 'Solang Valley Paragliding', category: 'Adventure', cost: 1800, durationMins: 60, description: 'Tandem paragliding flight over Solang Valley with stunning views of Himalayan peaks and the Beas River.', imageUrl: 'https://picsum.photos/id/56/800/600', rating: 4.75, tags: ['paragliding', 'valley', 'aerial'] },
      { name: 'Old Manali Café Hopping & Hippie Trail', category: 'Leisure', cost: 300, durationMins: 180, description: 'Explore the bohemian cafés, bakeries, and handicraft shops of Old Manali village along the Manalsu stream.', imageUrl: 'https://picsum.photos/id/57/800/600', rating: 4.50, tags: ['cafes', 'old-town', 'bohemian'] },
      { name: 'Hadimba Devi Temple & Cedar Forest Walk', category: 'Spiritual', cost: 0, durationMins: 90, description: 'Visit the 1553 pagoda-style Hadimba Temple set in a serene deodar cedar forest — a Mahabharata heritage site.', imageUrl: 'https://picsum.photos/id/58/800/600', rating: 4.60, tags: ['temple', 'cedar-forest', 'mythology'] },
      { name: 'Beas River Rafting & Camping', category: 'Adventure', cost: 1200, durationMins: 240, description: 'White-water rafting on the Beas River followed by riverside bonfire camping under the stars.', imageUrl: 'https://picsum.photos/id/59/800/600', rating: 4.65, tags: ['rafting', 'camping', 'bonfire'] },
      { name: 'Trout Fishing & Siddu Lunch Experience', category: 'Food & Dining', cost: 900, durationMins: 180, description: 'Catch-and-cook trout fishing in the Tirthan Valley, followed by a traditional Himachali Siddu (steamed bun) meal.', imageUrl: 'https://picsum.photos/id/60/800/600', rating: 4.55, tags: ['fishing', 'local-cuisine', 'himachali'] },
    ]
  },
  {
    name: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    region: 'West India',
    description: 'Maximum City — Bollywood dreams, colonial architecture, vibrant street food, and the Gateway of India.',
    costIndex: 1.10,
    popularityScore: 4.55,
    latitude: 19.0760,
    longitude: 72.8777,
    currency: 'INR',
    imageUrl: 'https://picsum.photos/id/61/800/600',
    activities: [
      { name: 'Gateway of India & Elephanta Caves Ferry', category: 'Culture & History', cost: 600, durationMins: 300, description: 'Take the harbour ferry from the iconic Gateway to the UNESCO Elephanta Caves with 6th-century Shiva sculptures.', imageUrl: 'https://picsum.photos/id/62/800/600', rating: 4.65, tags: ['gateway', 'caves', 'UNESCO'] },
      { name: 'Mumbai Street Food Trail — Chowpatty to Mohammed Ali Road', category: 'Food & Dining', cost: 500, durationMins: 180, description: 'Taste vada pav, pav bhaji, bhel puri, kebabs, and malpua on a guided crawl through Mumbai\'s iconic food streets.', imageUrl: 'https://picsum.photos/id/63/800/600', rating: 4.85, tags: ['street-food', 'vada-pav', 'food-walk'] },
      { name: 'Dharavi Creative Economy Walking Tour', category: 'Culture & History', cost: 800, durationMins: 150, description: 'Respectful tour of Dharavi\'s $1B informal economy — leather, pottery, recycling, and textile workshops.', imageUrl: 'https://picsum.photos/id/64/800/600', rating: 4.50, tags: ['walking-tour', 'social-enterprise', 'workshops'] },
      { name: 'Marine Drive Sunset & Art Deco Walk', category: 'Sightseeing', cost: 0, durationMins: 90, description: 'Stroll along the Queen\'s Necklace at sunset, admiring Mumbai\'s UNESCO Art Deco ensemble along Marine Drive.', imageUrl: 'https://picsum.photos/id/65/800/600', rating: 4.70, tags: ['sunset', 'art-deco', 'promenade'] },
      { name: 'Bollywood Studio Tour & Dance Workshop', category: 'Leisure', cost: 1500, durationMins: 240, description: 'Behind-the-scenes tour of Film City sets followed by a Bollywood dance lesson with a choreographer.', imageUrl: 'https://picsum.photos/id/66/800/600', rating: 4.55, tags: ['bollywood', 'studio', 'dance'] },
      { name: 'Taj Mahal Palace Heritage Stay', category: 'Lodging', cost: 25000, durationMins: 1440, description: 'Iconic 1903 palace hotel overlooking the Gateway of India — opulent rooms, sea-facing suites, and legendary hospitality.', imageUrl: 'https://picsum.photos/id/67/800/600', rating: 4.95, tags: ['palace-hotel', 'heritage', 'luxury'] },
    ]
  },
  {
    name: 'Delhi',
    state: 'Delhi',
    country: 'India',
    region: 'North India',
    description: 'India\'s capital — layers of Mughal, British, and modern history from Red Fort to India Gate to Hauz Khas.',
    costIndex: 0.85,
    popularityScore: 4.50,
    latitude: 28.6139,
    longitude: 77.2090,
    currency: 'INR',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Jama_Masjid_2011.jpg/960px-Jama_Masjid_2011.jpg',
    activities: [
      { name: 'Red Fort & Chandni Chowk Heritage Walk', category: 'Culture & History', cost: 500, durationMins: 180, description: 'Explore the Mughal Red Fort, then dive into the chaotic charm of Chandni Chowk — India\'s oldest and busiest market.', imageUrl: 'https://picsum.photos/id/69/800/600', rating: 4.70, tags: ['red-fort', 'mughal', 'old-delhi'] },
      { name: 'Chandni Chowk Paranthe Wali Gali Food Walk', category: 'Food & Dining', cost: 400, durationMins: 120, description: 'Legendary stuffed parantha lane, chole bhature, jalebi, and rabri at the 150-year-old shops of Old Delhi.', imageUrl: 'https://picsum.photos/id/70/800/600', rating: 4.85, tags: ['street-food', 'parantha', 'old-delhi'] },
      { name: 'Humayun\'s Tomb & Nizamuddin Qawwali', category: 'Spiritual', cost: 600, durationMins: 180, description: 'Visit the magnificent Mughal-era Humayun\'s Tomb, then attend a soul-stirring Sufi Qawwali at Nizamuddin Dargah.', imageUrl: 'https://picsum.photos/id/71/800/600', rating: 4.80, tags: ['mughal', 'qawwali', 'sufi'] },
      { name: 'Qutub Minar & Mehrauli Archaeological Park', category: 'Culture & History', cost: 350, durationMins: 150, description: 'Visit India\'s tallest stone minaret and the surrounding ruins spanning 1,000 years of Delhi sultanates.', imageUrl: 'https://picsum.photos/id/72/800/600', rating: 4.65, tags: ['qutub-minar', 'archaeological', 'UNESCO'] },
      { name: 'India Gate & Rajpath Evening Stroll', category: 'Sightseeing', cost: 0, durationMins: 90, description: 'Walk the grand Kartavya Path from Rashtrapati Bhavan to India Gate at sunset — Delhi\'s most iconic promenade.', imageUrl: 'https://picsum.photos/id/73/800/600', rating: 4.50, tags: ['india-gate', 'sunset', 'promenade'] },
      { name: 'Hauz Khas Village Art & Nightlife', category: 'Leisure', cost: 1200, durationMins: 180, description: 'Explore art galleries, designer boutiques, and rooftop bars in the trendy Hauz Khas Village beside the medieval lake.', imageUrl: 'https://picsum.photos/id/74/800/600', rating: 4.45, tags: ['nightlife', 'art', 'rooftop'] },
    ]
  },
  {
    name: 'Rishikesh',
    state: 'Uttarakhand',
    country: 'India',
    region: 'Himalayas',
    description: 'Yoga Capital of the World — where the Ganges flows from the Himalayas, offering adventure, spirituality, and peace.',
    costIndex: 0.50,
    popularityScore: 4.55,
    latitude: 30.0869,
    longitude: 78.2676,
    currency: 'INR',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Trayambakeshwar_Temple_VK.jpg/960px-Trayambakeshwar_Temple_VK.jpg',
    activities: [
      { name: 'Ganges White-Water Rafting (16km)', category: 'Adventure', cost: 1200, durationMins: 180, description: 'Raft 16km of Grade III–IV rapids on the Ganges from Shivpuri to Rishikesh with cliff jumping stops.', imageUrl: 'https://picsum.photos/id/76/800/600', rating: 4.80, tags: ['rafting', 'white-water', 'ganges'] },
      { name: 'Laxman Jhula & Trimbakeshwar Temple Walk', category: 'Spiritual', cost: 0, durationMins: 120, description: 'Cross the iconic suspension bridge and visit the 13-storey Trimbakeshwar temple complex on the east bank.', imageUrl: 'https://picsum.photos/id/77/800/600', rating: 4.55, tags: ['suspension-bridge', 'temple', 'walking'] },
      { name: 'Beatles Ashram (Chaurasi Kutia) Art Walk', category: 'Culture & History', cost: 150, durationMins: 120, description: 'Explore the abandoned ashram where The Beatles wrote the White Album — now a graffiti art gallery in the forest.', imageUrl: 'https://picsum.photos/id/78/800/600', rating: 4.60, tags: ['beatles', 'ashram', 'art'] },
      { name: 'Sunrise Yoga & Meditation Session', category: 'Spiritual', cost: 500, durationMins: 90, description: 'Join a traditional Hatha Yoga and guided meditation session at a Ganges-side ashram with Himalayan views.', imageUrl: 'https://picsum.photos/id/79/800/600', rating: 4.85, tags: ['yoga', 'meditation', 'sunrise'] },
      { name: 'Bungee Jumping at Jumpin Heights', category: 'Adventure', cost: 3550, durationMins: 60, description: 'India\'s highest bungee jump — 83 metres over a rocky ravine, operated by New Zealand jump masters.', imageUrl: 'https://picsum.photos/id/80/800/600', rating: 4.70, tags: ['bungee', 'extreme', 'adventure'] },
      { name: 'Triveni Ghat Evening Aarti', category: 'Spiritual', cost: 0, durationMins: 45, description: 'Attend the serene evening Ganga Aarti at Triveni Ghat where three sacred rivers meet — a gentle Himalayan ritual.', imageUrl: 'https://picsum.photos/id/81/800/600', rating: 4.75, tags: ['ganga-aarti', 'evening', 'spiritual'] },
    ]
  },

  // ═══════════ INTERNATIONAL CITIES ═══════════
  {
    name: 'Paris',
    state: null,
    country: 'France',
    region: 'International',
    description: 'The City of Light — world-class museums, iconic monuments, haute cuisine, and timeless romance.',
    costIndex: 1.45,
    popularityScore: 4.95,
    latitude: 48.8566,
    longitude: 2.3522,
    currency: 'EUR',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/960px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg',
    activities: [
      { name: 'Eiffel Tower Summit Tour', category: 'Sightseeing', cost: 3200, durationMins: 150, description: 'Ascend to the summit of the Eiffel Tower for panoramic views across Paris — book skip-the-line access.', imageUrl: 'https://picsum.photos/id/83/800/600', rating: 4.85, tags: ['eiffel-tower', 'panorama', 'landmark'] },
      { name: 'Louvre Museum Masterpieces Guided Walk', category: 'Culture & History', cost: 3800, durationMins: 180, description: 'Explore the Mona Lisa, Venus de Milo, and Winged Victory with an expert art historian guide.', imageUrl: 'https://picsum.photos/id/84/800/600', rating: 4.90, tags: ['louvre', 'art', 'museum'] },
      { name: 'Seine River Sunset Dinner Cruise', category: 'Food & Dining', cost: 7200, durationMins: 120, description: 'Enjoy a 3-course French dinner while cruising past illuminated Parisian monuments at twilight.', imageUrl: 'https://picsum.photos/id/85/800/600', rating: 4.80, tags: ['seine', 'dinner-cruise', 'romantic'] },
      { name: 'Montmartre & Sacré-Cœur Walking Tour', category: 'Sightseeing', cost: 1700, durationMins: 120, description: 'Stroll through bohemian Montmartre, visit the artists\' square at Place du Tertre, and enter Sacré-Cœur.', imageUrl: 'https://picsum.photos/id/87/800/600', rating: 4.70, tags: ['montmartre', 'walking-tour', 'bohemian'] },
      { name: 'Croissant & Pastry Baking Masterclass', category: 'Food & Dining', cost: 5500, durationMins: 180, description: 'Learn artisan techniques of classic French pastry and puff dough with a Parisian baker in a private atelier.', imageUrl: 'https://picsum.photos/id/88/800/600', rating: 4.75, tags: ['baking', 'pastry', 'masterclass'] },
      { name: 'Palace of Versailles Day Trip', category: 'Culture & History', cost: 4600, durationMins: 360, description: 'Tour the Hall of Mirrors, Grand Apartments, and magnificent Royal Gardens of Versailles.', imageUrl: 'https://picsum.photos/id/89/800/600', rating: 4.80, tags: ['versailles', 'palace', 'day-trip'] },
    ]
  },
  {
    name: 'Tokyo',
    state: null,
    country: 'Japan',
    region: 'International',
    description: 'Where ancient temples meet neon-lit skyscrapers — a dazzling blend of tradition and ultra-modernity.',
    costIndex: 1.30,
    popularityScore: 4.90,
    latitude: 35.6762,
    longitude: 139.6503,
    currency: 'JPY',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/960px-Skyscrapers_of_Shinjuku_2009_January.jpg',
    activities: [
      { name: 'Senso-ji Temple & Asakusa Traditional Walk', category: 'Culture & History', cost: 0, durationMins: 120, description: 'Visit Tokyo\'s oldest Buddhist temple and browse traditional craft shops along the Nakamise shopping street.', imageUrl: 'https://picsum.photos/id/91/800/600', rating: 4.75, tags: ['temple', 'asakusa', 'traditional'] },
      { name: 'Shibuya Crossing & Harajuku Pop-Culture Safari', category: 'Sightseeing', cost: 0, durationMins: 180, description: 'Experience the world\'s busiest pedestrian crossing then explore Harajuku\'s Takeshita Street fashion scene.', imageUrl: 'https://picsum.photos/id/92/800/600', rating: 4.70, tags: ['shibuya', 'harajuku', 'pop-culture'] },
      { name: 'Tsukiji Outer Market Sushi Masterclass', category: 'Food & Dining', cost: 6500, durationMins: 150, description: 'Learn to make nigiri and maki sushi with a master sushi chef at the legendary Tsukiji Outer Market.', imageUrl: 'https://picsum.photos/id/93/800/600', rating: 4.90, tags: ['sushi', 'cooking-class', 'tsukiji'] },
      { name: 'TeamLab Borderless Digital Art Museum', category: 'Leisure', cost: 2800, durationMins: 120, description: 'Immersive, boundary-less digital art installations where you walk through flowing water, flowers, and light.', imageUrl: 'https://picsum.photos/id/94/800/600', rating: 4.85, tags: ['teamlab', 'digital-art', 'immersive'] },
      { name: 'Mount Fuji & Hakone Day Trip', category: 'Sightseeing', cost: 8500, durationMins: 600, description: 'Day trip to see Mount Fuji from Lake Kawaguchiko, cruise Lake Ashi, and ride the Hakone ropeway.', imageUrl: 'https://picsum.photos/id/95/800/600', rating: 4.80, tags: ['mount-fuji', 'hakone', 'day-trip'] },
      { name: 'Golden Gai Bar Hopping Experience', category: 'Food & Dining', cost: 3000, durationMins: 150, description: 'Explore the 200+ tiny bars of Shinjuku Golden Gai with a local guide — each seats just 6-8 people.', imageUrl: 'https://picsum.photos/id/96/800/600', rating: 4.65, tags: ['nightlife', 'bars', 'shinjuku'] },
    ]
  },
  {
    name: 'Rome',
    state: null,
    country: 'Italy',
    region: 'International',
    description: 'The Eternal City — 2,500 years of art, architecture, and culinary tradition from the Colosseum to Vatican City.',
    costIndex: 1.25,
    popularityScore: 4.80,
    latitude: 41.9028,
    longitude: 12.4964,
    currency: 'EUR',
    imageUrl: 'https://picsum.photos/id/98/800/600',
    activities: [
      { name: 'Colosseum & Roman Forum VIP Underground Tour', category: 'Culture & History', cost: 5500, durationMins: 180, description: 'Skip-the-line access to the Colosseum arena floor, underground chambers, and the ancient Roman Forum ruins.', imageUrl: 'https://picsum.photos/id/99/800/600', rating: 4.90, tags: ['colosseum', 'ruins', 'VIP'] },
      { name: 'Vatican Museums, Sistine Chapel & St. Peter\'s', category: 'Culture & History', cost: 4800, durationMins: 240, description: 'Guided tour of the Vatican Museums, Raphael Rooms, Michelangelo\'s Sistine Chapel, and St. Peter\'s Basilica.', imageUrl: 'https://picsum.photos/id/100/800/600', rating: 4.95, tags: ['vatican', 'sistine-chapel', 'art'] },
      { name: 'Trastevere Food & Wine Walking Tour', category: 'Food & Dining', cost: 4200, durationMins: 180, description: 'Taste authentic Roman cuisine — supplì, cacio e pepe, porchetta, and local wines in the charming Trastevere quarter.', imageUrl: 'https://picsum.photos/id/101/800/600', rating: 4.80, tags: ['food-tour', 'wine', 'trastevere'] },
      { name: 'Trevi Fountain, Pantheon & Piazza Navona Walk', category: 'Sightseeing', cost: 0, durationMins: 120, description: 'Self-guided walk through Rome\'s most beautiful piazzas — toss a coin at Trevi and marvel at the Pantheon\'s dome.', imageUrl: 'https://picsum.photos/id/102/800/600', rating: 4.70, tags: ['trevi', 'pantheon', 'walking'] },
      { name: 'Pasta-Making Class in a Roman Home', category: 'Food & Dining', cost: 5000, durationMins: 180, description: 'Learn to make fresh pasta — fettuccine, ravioli, and tiramisu — with a local nonna in her home kitchen.', imageUrl: 'https://picsum.photos/id/103/800/600', rating: 4.85, tags: ['pasta', 'cooking-class', 'home-dining'] },
    ]
  },
  {
    name: 'Bali',
    state: null,
    country: 'Indonesia',
    region: 'International',
    description: 'Island of the Gods — lush rice terraces, ancient temples, volcanic peaks, surf breaks, and wellness retreats.',
    costIndex: 0.55,
    popularityScore: 4.75,
    latitude: -8.3405,
    longitude: 115.0920,
    currency: 'IDR',
    imageUrl: 'https://picsum.photos/id/104/800/600',
    activities: [
      { name: 'Tegallalang Rice Terrace & Swing', category: 'Sightseeing', cost: 800, durationMins: 120, description: 'Walk the stunning UNESCO rice terraces of Tegallalang and ride the famous Bali swing over the jungle canopy.', imageUrl: 'https://picsum.photos/id/106/800/600', rating: 4.75, tags: ['rice-terrace', 'swing', 'UNESCO'] },
      { name: 'Uluwatu Temple Sunset & Kecak Fire Dance', category: 'Culture & History', cost: 600, durationMins: 150, description: 'Watch the sunset from the cliff-top Uluwatu Temple, then enjoy the mesmerising Kecak fire dance performance.', imageUrl: 'https://picsum.photos/id/107/800/600', rating: 4.85, tags: ['temple', 'sunset', 'kecak'] },
      { name: 'Mount Batur Sunrise Trek', category: 'Adventure', cost: 2500, durationMins: 360, description: 'Pre-dawn hike to the summit of active volcano Mount Batur for an unforgettable sunrise above the clouds.', imageUrl: 'https://picsum.photos/id/108/800/600', rating: 4.80, tags: ['volcano', 'trekking', 'sunrise'] },
      { name: 'Ubud Monkey Forest & Art Market', category: 'Leisure', cost: 400, durationMins: 120, description: 'Visit the Sacred Monkey Forest Sanctuary and browse the vibrant Ubud Art Market for batik and wood carvings.', imageUrl: 'https://picsum.photos/id/109/800/600', rating: 4.60, tags: ['monkey-forest', 'art-market', 'ubud'] },
      { name: 'Balinese Cooking Class & Jimbaran Seafood', category: 'Food & Dining', cost: 1500, durationMins: 240, description: 'Learn to cook satay, nasi goreng, and lawar in a family compound, then feast on grilled seafood at Jimbaran Bay.', imageUrl: 'https://picsum.photos/id/110/800/600', rating: 4.75, tags: ['cooking-class', 'seafood', 'jimbaran'] },
      { name: 'Spa & Flower Bath Wellness Retreat', category: 'Leisure', cost: 2000, durationMins: 180, description: 'Traditional Balinese massage, body scrub, and iconic flower petal bath in a jungle-set wellness retreat.', imageUrl: 'https://picsum.photos/id/111/800/600', rating: 4.85, tags: ['spa', 'wellness', 'flower-bath'] },
    ]
  },
  {
    name: 'Dubai',
    state: null,
    country: 'United Arab Emirates',
    region: 'International',
    description: 'City of superlatives — the world\'s tallest building, luxury shopping, desert safaris, and futuristic architecture.',
    costIndex: 1.60,
    popularityScore: 4.65,
    latitude: 25.2048,
    longitude: 55.2708,
    currency: 'AED',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c7/Burj_Khalifa_2021.jpg/960px-Burj_Khalifa_2021.jpg',
    activities: [
      { name: 'Burj Khalifa At the Top Observation Deck', category: 'Sightseeing', cost: 3500, durationMins: 90, description: 'Visit the 124th & 148th floors of the world\'s tallest building for 360° views across Dubai and the Arabian Gulf.', imageUrl: 'https://picsum.photos/id/113/800/600', rating: 4.80, tags: ['burj-khalifa', 'observation', 'landmark'] },
      { name: 'Desert Safari — Dune Bashing, BBQ & Belly Dance', category: 'Adventure', cost: 4000, durationMins: 360, description: 'SUV dune bashing, camel rides, sandboarding, henna art, BBQ dinner, and traditional belly dance under the stars.', imageUrl: 'https://picsum.photos/id/114/800/600', rating: 4.75, tags: ['desert', 'safari', 'BBQ'] },
      { name: 'Dubai Mall & Dubai Fountain Show', category: 'Leisure', cost: 0, durationMins: 180, description: 'Explore the world\'s largest mall, visit the aquarium and ice rink, and watch the spectacular Dubai Fountain at night.', imageUrl: 'https://picsum.photos/id/115/800/600', rating: 4.65, tags: ['mall', 'fountain', 'shopping'] },
      { name: 'Old Dubai Heritage Tour — Al Fahidi & Souks', category: 'Culture & History', cost: 600, durationMins: 150, description: 'Explore the Al Fahidi Historical District, take an abra across Dubai Creek, and bargain in the Gold and Spice Souks.', imageUrl: 'https://picsum.photos/id/116/800/600', rating: 4.55, tags: ['heritage', 'souks', 'old-dubai'] },
      { name: 'Palm Jumeirah Yacht Sunset Cruise', category: 'Leisure', cost: 8000, durationMins: 120, description: 'Private yacht cruise around Palm Jumeirah and the Dubai Marina skyline with canapés and sunset views.', imageUrl: 'https://picsum.photos/id/117/800/600', rating: 4.85, tags: ['yacht', 'sunset', 'luxury'] },
    ]
  },
];

// ─────────────────────────────────────────────────────────────
// MAIN SEED FUNCTION
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Starting GlobeTrotter database seeding...\n');

  // ────────────────────────────────
  // 1. Clean existing data
  // ────────────────────────────────
  console.log('🗑️  Cleaning existing data...');
  await prisma.tripActivity.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.sharedLink.deleteMany();
  await prisma.savedCity.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.city.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ All tables cleared.\n');

  // ────────────────────────────────
  // 2. Create demo users
  // ────────────────────────────────
  console.log('👤 Creating demo users...');
  const passwordHash = await bcrypt.hash('Explorer@2026', 10);

  const demoUser = await prisma.user.create({
    data: {
      name: 'Aarav Sharma',
      email: 'aarav@globetrotter.in',
      passwordHash,
      phone: '+91 98201 23456',
      bio: 'Travel photographer & heritage explorer based in Mumbai. 15 Indian states visited and counting! 🇮🇳',
      profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      currencyPref: 'INR',
      languagePref: 'en',
      isAdmin: false,
    },
  });
  console.log(`   ✅ Demo user: ${demoUser.name} (${demoUser.email})`);

  const adminUser = await prisma.user.create({
    data: {
      name: 'GlobeTrotter Admin',
      email: 'admin@globetrotter.in',
      passwordHash: await bcrypt.hash('Admin@2026', 10),
      profilePhoto: null,
      currencyPref: 'INR',
      languagePref: 'en',
      isAdmin: true,
    },
  });
  console.log(`   ✅ Admin user: ${adminUser.name} (${adminUser.email})\n`);

  // ────────────────────────────────
  // 3. Seed cities & activities
  // ────────────────────────────────
  console.log('🏙️  Seeding cities & activities...');
  const cityMap = {};
  let totalActivities = 0;

  for (const cityData of CITIES_DATA) {
    const { activities: activitiesData, ...cityFields } = cityData;

    const city = await prisma.city.create({
      data: cityFields,
    });

    cityMap[city.name] = city;

    const createdActivities = [];
    for (const actData of activitiesData) {
      const activity = await prisma.activity.create({
        data: {
          cityId: city.id,
          name: actData.name,
          category: actData.category,
          cost: actData.cost,
          currency: cityData.currency,
          durationMins: actData.durationMins,
          description: actData.description,
          imageUrl: actData.imageUrl,
          rating: actData.rating || null,
          tags: actData.tags || [],
        },
      });
      createdActivities.push(activity);
      totalActivities++;
    }

    cityMap[city.name].activities = createdActivities;
    console.log(`   ✅ ${city.name}, ${cityData.state || cityData.country} — ${createdActivities.length} activities`);
  }

  console.log(`\n📊 Total: ${Object.keys(cityMap).length} cities, ${totalActivities} activities seeded.\n`);

  // ────────────────────────────────
  // 4. Save favourite cities for demo user
  // ────────────────────────────────
  console.log('⭐ Saving favourite cities for Aarav...');
  const favCities = ['Jaipur', 'Udaipur', 'Goa', 'Leh', 'Varanasi'];
  for (const cityName of favCities) {
    if (cityMap[cityName]) {
      await prisma.savedCity.create({
        data: { userId: demoUser.id, cityId: cityMap[cityName].id },
      });
    }
  }
  console.log(`   ✅ ${favCities.length} cities saved.\n`);

  // ────────────────────────────────
  // 5. Create sample trips
  // ────────────────────────────────
  console.log('✈️  Creating sample trips...');

  // --- Trip 1: Royal Rajasthan Heritage Tour ---
  const rajasthanTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      name: 'Royal Rajasthan Heritage Tour',
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-10-25'),
      description: 'A 10-day luxury journey through the Pink City of Jaipur and the Lake City of Udaipur — exploring grand forts, ornate havelis, sunset boat cruises, and royal Rajasthani thali feasts.',
      coverPhoto: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
      totalBudget: 85000,
      status: 'PLANNED',
      isPublic: true,
      shareToken: 'rajasthan-heritage-2026',
    },
  });

  // Budget for Rajasthan trip
  await prisma.budget.create({
    data: {
      tripId: rajasthanTrip.id,
      dailyCap: 8500,
      categoryCaps: {
        lodging: 46500,
        food: 12500,
        transport: 6200,
        activities: 9500,
        shopping: 5000,
      },
    },
  });

  // Stops
  const jaipurStop = await prisma.stop.create({
    data: {
      tripId: rajasthanTrip.id,
      cityId: cityMap['Jaipur'].id,
      arrivalDate: new Date('2026-10-15'),
      departureDate: new Date('2026-10-20'),
      sortOrder: 0,
      notes: 'Main base: Samode Haveli. Book Amber Fort VIP tour in advance.',
    },
  });

  const udaipurStop = await prisma.stop.create({
    data: {
      tripId: rajasthanTrip.id,
      cityId: cityMap['Udaipur'].id,
      arrivalDate: new Date('2026-10-20'),
      departureDate: new Date('2026-10-25'),
      sortOrder: 1,
      notes: 'Taj Fateh Prakash Palace booked. Lake Pichola boat pre-booked for Oct 21 sunset.',
    },
  });

  // Trip Activities for Jaipur
  const jaipurActs = cityMap['Jaipur'].activities;
  const jaipurSchedule = [
    { actIdx: 0, date: '2026-10-15', time: '09:00 AM - 12:00 PM', order: 0 },
    { actIdx: 1, date: '2026-10-16', time: '05:30 AM - 07:00 AM', order: 1 },
    { actIdx: 2, date: '2026-10-16', time: '07:00 PM - 09:30 PM', order: 2 },
    { actIdx: 3, date: '2026-10-17', time: '10:00 AM - 12:00 PM', order: 3 },
    { actIdx: 4, date: '2026-10-17', time: '04:00 PM - 06:00 PM', order: 4 },
    { actIdx: 5, date: '2026-10-18', time: '11:00 AM - 01:00 PM', order: 5 },
    { actIdx: 6, date: '2026-10-15', time: 'Full Day', order: 6 },
  ];
  for (const s of jaipurSchedule) {
    await prisma.tripActivity.create({
      data: {
        stopId: jaipurStop.id,
        activityId: jaipurActs[s.actIdx].id,
        nameSnapshot: jaipurActs[s.actIdx].name,
        costSnapshot: jaipurActs[s.actIdx].cost,
        categorySnapshot: jaipurActs[s.actIdx].category,
        scheduledDate: new Date(s.date),
        timeSlot: s.time,
        sortOrder: s.order,
      },
    });
  }

  // Trip Activities for Udaipur
  const udaipurActs = cityMap['Udaipur'].activities;
  const udaipurSchedule = [
    { actIdx: 0, date: '2026-10-21', time: '04:30 PM - 06:00 PM', order: 0 },
    { actIdx: 1, date: '2026-10-22', time: '09:00 AM - 11:30 AM', order: 1 },
    { actIdx: 2, date: '2026-10-22', time: '07:30 PM - 09:30 PM', order: 2 },
    { actIdx: 3, date: '2026-10-20', time: 'Full Day', order: 3 },
    { actIdx: 4, date: '2026-10-23', time: '08:00 AM - 04:00 PM', order: 4 },
    { actIdx: 5, date: '2026-10-24', time: '07:00 PM - 08:15 PM', order: 5 },
  ];
  for (const s of udaipurSchedule) {
    await prisma.tripActivity.create({
      data: {
        stopId: udaipurStop.id,
        activityId: udaipurActs[s.actIdx].id,
        nameSnapshot: udaipurActs[s.actIdx].name,
        costSnapshot: udaipurActs[s.actIdx].cost,
        categorySnapshot: udaipurActs[s.actIdx].category,
        scheduledDate: new Date(s.date),
        timeSlot: s.time,
        sortOrder: s.order,
      },
    });
  }

  console.log(`   ✅ Trip 1: "${rajasthanTrip.name}" — 2 stops, ${jaipurSchedule.length + udaipurSchedule.length} activities`);

  // --- Trip 2: Kerala Backwaters & Tea Hills ---
  const keralaTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      name: 'Kerala Backwaters & Tea Hills',
      startDate: new Date('2026-12-20'),
      endDate: new Date('2026-12-28'),
      description: 'An 8-day exploration of God\'s Own Country — from the misty tea estates of Munnar to the palm-fringed houseboats of Alleppey.',
      coverPhoto: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      totalBudget: 55000,
      status: 'DRAFT',
      isPublic: true,
      shareToken: 'kerala-backwaters-2026',
    },
  });

  await prisma.budget.create({
    data: {
      tripId: keralaTrip.id,
      dailyCap: 7000,
      categoryCaps: { lodging: 25000, food: 8000, transport: 8000, activities: 10000 },
    },
  });

  const keralaStop = await prisma.stop.create({
    data: {
      tripId: keralaTrip.id,
      cityId: cityMap['Alleppey'].id,
      arrivalDate: new Date('2026-12-20'),
      departureDate: new Date('2026-12-28'),
      sortOrder: 0,
      notes: 'Premium 2-bedroom houseboat on Vembanad Lake. Munnar day trip on Dec 22.',
    },
  });

  const keralaActs = cityMap['Alleppey'].activities;
  for (let i = 0; i < keralaActs.length; i++) {
    await prisma.tripActivity.create({
      data: {
        stopId: keralaStop.id,
        activityId: keralaActs[i].id,
        nameSnapshot: keralaActs[i].name,
        costSnapshot: keralaActs[i].cost,
        categorySnapshot: keralaActs[i].category,
        scheduledDate: new Date(`2026-12-${20 + i}`),
        timeSlot: '10:00 AM',
        sortOrder: i,
      },
    });
  }

  console.log(`   ✅ Trip 2: "${keralaTrip.name}" — 1 stop, ${keralaActs.length} activities`);

  // --- Trip 3: Goa Coastal Getaway ---
  const goaTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      name: 'Goa Coastal Getaway',
      startDate: new Date('2026-11-10'),
      endDate: new Date('2026-11-17'),
      description: 'A 7-day coastal escape — from the Portuguese heritage of Fontainhas to the underwater world of Grand Island and beach shack feasts.',
      coverPhoto: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      totalBudget: 45000,
      status: 'DRAFT',
      isPublic: true,
      shareToken: 'goa-coastal-2026',
    },
  });

  await prisma.budget.create({
    data: {
      tripId: goaTrip.id,
      dailyCap: 6500,
      categoryCaps: { lodging: 18000, food: 7000, transport: 5000, activities: 10000 },
    },
  });

  const goaStop = await prisma.stop.create({
    data: {
      tripId: goaTrip.id,
      cityId: cityMap['Goa'].id,
      arrivalDate: new Date('2026-11-10'),
      departureDate: new Date('2026-11-17'),
      sortOrder: 0,
      notes: 'Latin Quarter villa in Fontainhas. Scuba on Nov 12 (pre-booked).',
    },
  });

  const goaActs = cityMap['Goa'].activities;
  for (let i = 0; i < goaActs.length; i++) {
    await prisma.tripActivity.create({
      data: {
        stopId: goaStop.id,
        activityId: goaActs[i].id,
        nameSnapshot: goaActs[i].name,
        costSnapshot: goaActs[i].cost,
        categorySnapshot: goaActs[i].category,
        scheduledDate: new Date(`2026-11-${10 + i}`),
        timeSlot: '10:00 AM',
        sortOrder: i,
      },
    });
  }

  console.log(`   ✅ Trip 3: "${goaTrip.name}" — 1 stop, ${goaActs.length} activities`);

  // --- Trip 4 (Past/Completed): Varanasi Spiritual Journey ---
  const varanasiTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      name: 'Varanasi Ghats & Ganga Aarti',
      startDate: new Date('2026-03-10'),
      endDate: new Date('2026-03-14'),
      description: 'A soul-stirring 4-day spiritual journey along the ancient ghats of Varanasi — sunrise boats, Ganga Aarti, and silk weaving.',
      coverPhoto: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
      totalBudget: 22000,
      status: 'COMPLETED',
      isPublic: true,
      shareToken: 'varanasi-ghats-2026',
    },
  });

  await prisma.budget.create({
    data: { tripId: varanasiTrip.id, dailyCap: 5500, categoryCaps: {} },
  });

  console.log(`   ✅ Trip 4: "${varanasiTrip.name}" (completed)`);

  // --- Trip 5 (Past/Completed): Leh-Ladakh ---
  const ladakhTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      name: 'Leh-Ladakh High Passes Adventure',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-06-10'),
      description: 'A 10-day high-altitude adventure — Pangong Tso stargazing, Nubra sand dunes, Khardung La summit, and Zanskar rafting.',
      coverPhoto: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
      totalBudget: 65000,
      status: 'COMPLETED',
      isPublic: false,
      shareToken: 'ladakh-passes-2026',
    },
  });

  await prisma.budget.create({
    data: { tripId: ladakhTrip.id, dailyCap: 6500, categoryCaps: {} },
  });

  console.log(`   ✅ Trip 5: "${ladakhTrip.name}" (completed)`);

  // --- Trip 6 (Past): European Summer ---
  const euroTrip = await prisma.trip.create({
    data: {
      userId: demoUser.id,
      name: 'European Summer — Paris & Rome',
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-07-14'),
      description: 'A 14-day European grand tour — Eiffel Tower, Louvre, Seine cruises in Paris, then Colosseum, Vatican, and pasta-making in Rome.',
      coverPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      totalBudget: 240000,
      status: 'COMPLETED',
      isPublic: true,
      shareToken: 'europe-summer-2026',
    },
  });

  await prisma.budget.create({
    data: { tripId: euroTrip.id, dailyCap: 18000, categoryCaps: {} },
  });

  // Paris stop
  const parisStop = await prisma.stop.create({
    data: {
      tripId: euroTrip.id,
      cityId: cityMap['Paris'].id,
      arrivalDate: new Date('2026-07-01'),
      departureDate: new Date('2026-07-08'),
      sortOrder: 0,
    },
  });

  const parisActs = cityMap['Paris'].activities;
  for (let i = 0; i < parisActs.length; i++) {
    await prisma.tripActivity.create({
      data: {
        stopId: parisStop.id,
        activityId: parisActs[i].id,
        nameSnapshot: parisActs[i].name,
        costSnapshot: parisActs[i].cost,
        categorySnapshot: parisActs[i].category,
        scheduledDate: new Date(`2026-07-${1 + i}`),
        timeSlot: '10:00 AM',
        sortOrder: i,
      },
    });
  }

  // Rome stop
  const romeStop = await prisma.stop.create({
    data: {
      tripId: euroTrip.id,
      cityId: cityMap['Rome'].id,
      arrivalDate: new Date('2026-07-08'),
      departureDate: new Date('2026-07-14'),
      sortOrder: 1,
    },
  });

  const romeActs = cityMap['Rome'].activities;
  for (let i = 0; i < romeActs.length; i++) {
    await prisma.tripActivity.create({
      data: {
        stopId: romeStop.id,
        activityId: romeActs[i].id,
        nameSnapshot: romeActs[i].name,
        costSnapshot: romeActs[i].cost,
        categorySnapshot: romeActs[i].category,
        scheduledDate: new Date(`2026-07-${8 + i}`),
        timeSlot: '10:00 AM',
        sortOrder: i,
      },
    });
  }

  console.log(`   ✅ Trip 6: "${euroTrip.name}" (completed) — 2 stops`);

  // ────────────────────────────────
  // 6. Create shared links
  // ────────────────────────────────
  console.log('\n🔗 Creating shared links...');
  const sharedTrips = [
    { trip: rajasthanTrip, views: 1240 },
    { trip: keralaTrip, views: 890 },
    { trip: goaTrip, views: 567 },
    { trip: varanasiTrip, views: 340 },
    { trip: euroTrip, views: 215 },
  ];
  for (const { trip, views } of sharedTrips) {
    if (trip.shareToken) {
      await prisma.sharedLink.create({
        data: {
          tripId: trip.id,
          shareToken: trip.shareToken,
          viewCount: views,
        },
      });
    }
  }
  console.log(`   ✅ ${sharedTrips.length} shared links created.\n`);

  // ────────────────────────────────
  // 7. Summary
  // ────────────────────────────────
  const counts = {
    users: await prisma.user.count(),
    cities: await prisma.city.count(),
    activities: await prisma.activity.count(),
    trips: await prisma.trip.count(),
    stops: await prisma.stop.count(),
    tripActivities: await prisma.tripActivity.count(),
    budgets: await prisma.budget.count(),
    sharedLinks: await prisma.sharedLink.count(),
    savedCities: await prisma.savedCity.count(),
  };

  console.log('══════════════════════════════════════════════════');
  console.log('🎉 DATABASE SEEDING COMPLETE');
  console.log('══════════════════════════════════════════════════');
  console.log(`  👤 Users:           ${counts.users}`);
  console.log(`  🏙️  Cities:          ${counts.cities}`);
  console.log(`  🎯 Activities:      ${counts.activities}`);
  console.log(`  ✈️  Trips:           ${counts.trips}`);
  console.log(`  📍 Stops:           ${counts.stops}`);
  console.log(`  📋 Trip Activities: ${counts.tripActivities}`);
  console.log(`  💰 Budgets:         ${counts.budgets}`);
  console.log(`  🔗 Shared Links:    ${counts.sharedLinks}`);
  console.log(`  ⭐ Saved Cities:    ${counts.savedCities}`);
  console.log('══════════════════════════════════════════════════');
  console.log('');
  console.log('🔑 Demo Login Credentials:');
  console.log('   Email:    aarav@globetrotter.in');
  console.log('   Password: Explorer@2026');
  console.log('');
  console.log('🔑 Admin Login Credentials:');
  console.log('   Email:    admin@globetrotter.in');
  console.log('   Password: Admin@2026');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
