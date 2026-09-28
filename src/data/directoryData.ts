import { City, Category, Vendor, Review, EnquiryLead, NotificationItem } from '../types';

export const INITIAL_CITIES: City[] = [
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    gujaratiName: 'અમદાવાદ',
    hindiName: 'अहमदाबाद',
    popular: true,
    lat: 23.0225,
    lng: 72.5714,
    areas: [
      'Satellite',
      'Vastrapur',
      'Navrangpura',
      'Maninagar',
      'Bopal',
      'SG Highway',
      'Chandkheda',
      'Gota',
      'Nikol',
      'Isanpur',
      'Prahlad Nagar',
      'Thaltej',
      'Bodakdev',
      'Shahibaug',
      'Naranpura',
      'Paldi',
      'Sola',
      'Ambawadi',
      'Makarba',
      'South Bopal'
    ]
  },
  {
    id: 'surat',
    name: 'Surat',
    gujaratiName: 'સુરત',
    hindiName: 'सूरत',
    popular: true,
    lat: 21.1702,
    lng: 72.8311,
    areas: [
      'Adajan',
      'Vesu',
      'Piplod',
      'Varachha',
      'Katargam',
      'Pal',
      'City Light',
      'Rander',
      'Athwa',
      'Dindoli',
      'Udhna',
      'Althan'
    ]
  },
  {
    id: 'vadodara',
    name: 'Vadodara',
    gujaratiName: 'વડોદરા',
    hindiName: 'वडोदरा',
    popular: true,
    lat: 22.3072,
    lng: 73.1812,
    areas: [
      'Alkapuri',
      'Akota',
      'Gotri',
      'Manjalpur',
      'Karelibaug',
      'Sayajigunj',
      'Fatehgunj',
      'Vasna Road',
      'Waghodia Road',
      'Subhanpura',
      'Ellora Park'
    ]
  },
  {
    id: 'rajkot',
    name: 'Rajkot',
    gujaratiName: 'રાજકોટ',
    hindiName: 'राजकोट',
    popular: true,
    lat: 22.3039,
    lng: 70.8022,
    areas: [
      'Kalawad Road',
      'Yagnik Road',
      'University Road',
      'Mavdi',
      '150 Feet Ring Road',
      'Amin Marg',
      'Kotecha Chowk',
      'Raiya Road',
      'Bhaktinagar',
      'Nana Mava'
    ]
  },
  {
    id: 'gandhinagar',
    name: 'Gandhinagar',
    gujaratiName: 'ગાંધીનગર',
    hindiName: 'गांधीनगर',
    popular: true,
    lat: 23.2156,
    lng: 72.6369,
    areas: [
      'Sector 1',
      'Sector 6',
      'Sector 7',
      'Sector 11',
      'Sector 16',
      'Sector 21',
      'Infocity',
      'Kudasan',
      'Randesan',
      'Sargasan',
      'Bhat'
    ]
  },
  {
    id: 'bhavnagar',
    name: 'Bhavnagar',
    gujaratiName: 'ભાવનગર',
    hindiName: 'भावनगर',
    popular: false,
    lat: 21.7645,
    lng: 72.1519,
    areas: ['Waghawadi Road', 'Kaliabid', 'Ghogha Circle', 'Subhashnagar', 'Kalanala']
  },
  {
    id: 'jamnagar',
    name: 'Jamnagar',
    gujaratiName: 'જામનગર',
    hindiName: 'जामनगर',
    popular: false,
    lat: 22.4707,
    lng: 70.0577,
    areas: ['Patel Colony', 'Digvijay Plot', 'Indira Marg', 'Sumair Club Road', 'Gulabnagar']
  },
  {
    id: 'junagadh',
    name: 'Junagadh',
    gujaratiName: 'જૂનાગઢ',
    hindiName: 'जूनागढ़',
    popular: false,
    lat: 21.5222,
    lng: 70.4579,
    areas: ['Zanzarda Road', 'Motibaug', 'Mendarda Road', 'Joshipura', 'Kalwa Chowk']
  },
  {
    id: 'anand',
    name: 'Anand',
    gujaratiName: 'આણંદ',
    hindiName: 'आणंद',
    popular: false,
    lat: 22.5645,
    lng: 72.9289,
    areas: ['Vallabh Vidyanagar', 'Gamdi', 'Borsad Chokdi', 'Amul Dairy Road', 'Jitodia']
  },
  {
    id: 'nadiad',
    name: 'Nadiad',
    gujaratiName: 'નડિયાદ',
    hindiName: 'नडियाद',
    popular: false,
    lat: 22.6916,
    lng: 72.8634,
    areas: ['College Road', 'Santram Mandir Road', 'Mission Area', 'Dabhan', 'Uttarsanda Road']
  },
  {
    id: 'bharuch',
    name: 'Bharuch',
    gujaratiName: 'ભરૂચ',
    hindiName: 'भरूच',
    popular: false,
    lat: 21.7051,
    lng: 72.9959,
    areas: ['Zadeshwar Road', 'Link Road', 'Station Road', 'Bholav', 'GNFC Township']
  },
  {
    id: 'vapi',
    name: 'Vapi',
    gujaratiName: 'વાપી',
    hindiName: 'वापी',
    popular: false,
    lat: 20.3893,
    lng: 72.9106,
    areas: ['GIDC', 'Gunjan', 'Chala', 'Morarji Circle', 'Koparli Road']
  },
  {
    id: 'navsari',
    name: 'Navsari',
    gujaratiName: 'નવસારી',
    hindiName: 'नवसारी',
    popular: false,
    lat: 20.9500,
    lng: 72.9300,
    areas: ['Lunsikui', 'Jalalpor', 'Vijalpor', 'Tower Road', 'Chhapra Road']
  },
  {
    id: 'mehsana',
    name: 'Mehsana',
    gujaratiName: 'મહેસાણા',
    hindiName: 'मेहसाणा',
    popular: false,
    lat: 23.5880,
    lng: 72.3693,
    areas: ['Radhanpur Road', 'Modhera Road', 'Nagalpur', 'Dairy Road', 'Urban Bank Colony']
  },
  {
    id: 'morbi',
    name: 'Morbi',
    gujaratiName: 'મોરબી',
    hindiName: 'मोरबी',
    popular: false,
    lat: 22.8120,
    lng: 70.8378,
    areas: ['Sanala Road', 'Kandla Highway', 'Trajpar', 'Ravapar Road', 'Lakhdhirpur Road']
  },
  {
    id: 'gandhidham',
    name: 'Gandhidham',
    gujaratiName: 'ગાંધીધામ',
    hindiName: 'गांधीधाम',
    popular: false,
    lat: 23.0753,
    lng: 70.1337,
    areas: ['Sector 1', 'Sector 8', 'Rotary Circle', 'Tagore Road', 'Oslo Circle']
  },
  {
    id: 'bhuj',
    name: 'Bhuj',
    gujaratiName: 'ભુજ',
    hindiName: 'भुज',
    popular: false,
    lat: 23.2420,
    lng: 69.6669,
    areas: ['Jubilee Ground', 'Mirzapar', 'Madhapar', 'Hospital Road', 'Station Road']
  },
  {
    id: 'porbandar',
    name: 'Porbandar',
    gujaratiName: 'પોરબંદર',
    hindiName: 'पोरबंदर',
    popular: false,
    lat: 21.6417,
    lng: 69.6293,
    areas: ['Chowpati', 'MG Road', 'Rokadiya Hanuman', 'Birla Sagar', 'Kamala Nehru Park']
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'electrician',
    name: 'Electrician',
    gujaratiName: 'ઇલેક્ટ્રિશિયન',
    hindiName: 'इलेक्ट्रीशियन',
    iconName: 'Zap',
    popular: true,
    subcategories: [
      {
        id: 'home_electrician',
        name: 'Home Electrician',
        services: ['Wiring & Rewiring', 'Switchboard Repair', 'Fan Installation', 'Light & Chandelier Fitting', 'MCB Tripping Fault']
      },
      {
        id: 'commercial_electrician',
        name: 'Commercial & Industrial',
        services: ['Panel Board Work', '3-Phase Power Setup', 'Industrial Wiring', 'Transformer Check']
      },
      {
        id: 'solar_inverter',
        name: 'Solar & Inverter Setup',
        services: ['Home Inverter Installation', 'Battery Replacement', 'Rooftop Solar Maintenance']
      }
    ]
  },
  {
    id: 'plumber',
    name: 'Plumber',
    gujaratiName: 'પ્લમ્બર',
    hindiName: 'प्लंबर',
    iconName: 'Wrench',
    popular: true,
    subcategories: [
      {
        id: 'home_plumbing',
        name: 'Home Plumbing',
        services: ['Tap & Faucet Repair', 'Bathroom Fitting', 'Water Tank Cleaning', 'Drainage Blockage Clearing', 'Pipeline Leakage Fixing']
      },
      {
        id: 'commercial_plumbing',
        name: 'Commercial Pipeline & Motors',
        services: ['Submersible Pump Fitting', 'Pressure Pump Installation', 'RO Pipeline Laying']
      }
    ]
  },
  {
    id: 'ac_services',
    name: 'AC Services & Repair',
    gujaratiName: 'એસી સર્વિસ અને રિપેર',
    hindiName: 'एसी रिपेयर और सर्विस',
    iconName: 'AirVent',
    popular: true,
    subcategories: [
      {
        id: 'ac_repair',
        name: 'AC Repair & Servicing',
        services: ['Deep Foam Jet Cleaning', 'Gas Refilling (R32 / R410)', 'Compressor Repair', 'AC Uninstallation & Moving', 'Split & Window AC Fitting']
      },
      {
        id: 'commercial_hvac',
        name: 'Central & Commercial HVAC',
        services: ['Cassette AC Service', 'Ductable AC Maintenance', 'Tower AC Fitting']
      }
    ]
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    gujaratiName: 'સુથાર (કાર્પેન્ટર)',
    hindiName: 'बढ़ई (कारपेंटर)',
    iconName: 'Hammer',
    popular: true,
    subcategories: [
      {
        id: 'furniture_repair',
        name: 'Furniture Repair & Making',
        services: ['Door Lock & Hinge Fitting', 'Bed & Wardrobe Assembly', 'Modular Kitchen Repair', 'Sofa Frame Restoration', 'Custom Woodwork']
      }
    ]
  },
  {
    id: 'appliance_repair',
    name: 'Appliance Repair',
    gujaratiName: 'ઘર વપરાશ મશીન રિપેર',
    hindiName: 'उपकरण मरम्मत',
    iconName: 'Tv',
    popular: true,
    subcategories: [
      {
        id: 'refrigerator_washing',
        name: 'Washing Machine & Fridge',
        services: ['Automatic Washing Machine Repair', 'Double Door Fridge Gas Filling', 'Microwave Oven Servicing', 'Dishwasher Fix']
      }
    ]
  },
  {
    id: 'cleaning',
    name: 'Deep Cleaning & Pest Control',
    gujaratiName: 'સફાઈ અને પેસ્ટ કંટ્રોલ',
    hindiName: 'सफाई और पेस्ट कंट्रोल',
    iconName: 'Sparkles',
    popular: true,
    subcategories: [
      {
        id: 'home_cleaning',
        name: 'Deep Home Cleaning',
        services: ['Full House Deep Cleaning', 'Bathroom Disinfection', 'Kitchen Degreasing', 'Sofa & Carpet Shampooing', 'Water Tank Cleaning']
      },
      {
        id: 'pest_control',
        name: 'Pest Control Services',
        services: ['Termite (ઉધઈ) Treatment', 'Cockroach Gel Treatment', 'Bedbugs Spray', 'Mosquito Fogging']
      }
    ]
  },
  {
    id: 'painter',
    name: 'Painting & Waterproofing',
    gujaratiName: 'કલરકામ અને વોટરપ્રૂફિંગ',
    hindiName: 'पेंटर और वाटरप्रूफिंग',
    iconName: 'Paintbrush',
    popular: true,
    subcategories: [
      {
        id: 'home_painting',
        name: 'Interior & Exterior Painting',
        services: ['Wall Putty & Primer', 'Royale Texture Painting', 'Exterior Apex Weatherproof', 'Terrace Waterproofing Leakage Fix']
      }
    ]
  },
  {
    id: 'ro_purifier',
    name: 'RO Water Purifier',
    gujaratiName: 'આર.ઓ. વોટર પ્યુરિફાયર',
    hindiName: 'आरओ वाटर प्यूरीफायर',
    iconName: 'Droplets',
    popular: true,
    subcategories: [
      {
        id: 'ro_service',
        name: 'RO Filter & Membrane',
        services: ['Annual RO Service (Filter Change)', 'Membrane Replacement', 'TDS Balancing', 'New RO Unit Installation', 'Commercial RO Plant']
      }
    ]
  },
  {
    id: 'cctv_security',
    name: 'CCTV & Security Systems',
    gujaratiName: 'સીસીટીવી કેમેરા અને સુરક્ષા',
    hindiName: 'सीसीटीवी और सुरक्षा',
    iconName: 'ShieldCheck',
    popular: false,
    subcategories: [
      {
        id: 'cctv_install',
        name: 'CCTV Camera Setup',
        services: ['HD & IP Camera Installation', 'DVR / NVR Setup', 'Mobile Live View Configuration', 'Intercom & Video Door Phone']
      }
    ]
  },
  {
    id: 'mechanic',
    name: 'Auto Mechanic & Bike Repair',
    gujaratiName: 'વાહન મિકેનિક અને ગેરેજ',
    hindiName: 'ऑटो मैकेनिक व गैरेज',
    iconName: 'Car',
    popular: false,
    subcategories: [
      {
        id: 'two_wheeler',
        name: 'Two-Wheeler Service',
        services: ['Doorstep Two-Wheeler Servicing', 'Puncture & Battery Jumpstart', 'Engine Oil Change', 'Brake Pad Replacement']
      },
      {
        id: 'four_wheeler',
        name: 'Car Repair & Detailing',
        services: ['Car Foam Wash & Polish', 'Car AC Repair', 'Clutch & Brake Overhaul', 'Roadside Assistance (Towing)']
      }
    ]
  },
  {
    id: 'beauty_salon',
    name: 'Beauty & Salon at Home',
    gujaratiName: 'બ્યુટી અને સલૂન સેવા',
    hindiName: 'બ્યુટી અને સલૂન',
    iconName: 'Scissors',
    popular: false,
    subcategories: [
      {
        id: 'women_salon',
        name: 'Salon at Home',
        services: ['Facial & Clean-up', 'Waxing & Threading', 'Bridal Mehndi & Makeup', 'Hair Spa & Cut']
      }
    ]
  },
  {
    id: 'packers_movers',
    name: 'Packers & Movers',
    gujaratiName: 'પેકર્સ અને મુવર્સ',
    hindiName: 'पैकर्स एंड मूवर्स',
    iconName: 'Truck',
    popular: false,
    subcategories: [
      {
        id: 'shifting',
        name: 'Home & Office Shifting',
        services: ['Local Within City Shifting', 'Intercity Gujarat Relocation', 'Fragile Item Bubble Packing', 'Vehicle Transportation']
      }
    ]
  },
  {
    id: 'solar_energy',
    name: 'Solar Rooftop & Surya Gujarat',
    gujaratiName: 'સોલર રૂફટોપ અને સૂર્ય ગુજરાત',
    hindiName: 'सोलर रूफटॉप व सूर्य योजना',
    iconName: 'Sun',
    popular: true,
    subcategories: [
      {
        id: 'residential_solar',
        name: 'Residential Rooftop 3kW - 10kW',
        services: [
          'Surya Gujarat Scheme Subsidy Setup',
          'On-Grid Inverter Installation',
          'Net Metering Approval Liaison',
          'Bi-directional Meter Testing',
          'Solar Panel High-Pressure Foam Cleaning'
        ]
      },
      {
        id: 'commercial_solar',
        name: 'Commercial & Industrial Solar Plants',
        services: [
          '50kW - 500kW Industrial Rooftop',
          'Solar Water Heater Installation',
          'Hybrid Battery Storage Solutions',
          'Annual Solar Maintenance Contract (AMC)'
        ]
      }
    ]
  },
  {
    id: 'catering_farsan',
    name: 'Caterers, Mandap & Farsan',
    gujaratiName: 'કેટરર્સ, મંડપ અને ગુજરાતી ફરસાણ',
    hindiName: 'कैटरर्स, मंडप व गुजराती फरसाण',
    iconName: 'UtensilsCrossed',
    popular: true,
    subcategories: [
      {
        id: 'wedding_catering',
        name: 'Wedding & Social Feast Catering',
        services: [
          'Traditional Gujarati & Kathiyawadi Thali',
          'Pure Jain & Swaminarayan Cooking',
          'Live Farsan Counter (Jalebi, Fafda, Khaman)',
          'Royal Reception Buffet',
          'Mahuva & Surati Special Desserts'
        ]
      },
      {
        id: 'mandap_decoration',
        name: 'Mandap, Chori & Stage Decor',
        services: [
          'Traditional Wooden Mandap & Chori',
          'Floral Stage & Entry Arch',
          'Haldi & Sangeet Theme Decor',
          'Varmala Special Effects'
        ]
      }
    ]
  },
  {
    id: 'diamond_jewelry',
    name: 'Jewelry Polishing & Gold Artisans',
    gujaratiName: 'સોની કામ અને જ્વેલરી પોલિશ',
    hindiName: 'ज्वेलरी पॉलिश व स्वर्ण कारीगर',
    iconName: 'Gem',
    popular: true,
    subcategories: [
      {
        id: 'gold_diamond_service',
        name: 'Jewelry Repair & Restoration',
        services: [
          'Ultrasonic Gold & Diamond Cleaning',
          'Laser Stone Setting & Prong Repair',
          'Ring Resizing & Soldering',
          'Rhodium & Antique Matte Polish',
          'Kundan & Meenakari Restoration',
          'BIS Hallmark Testing Assistance'
        ]
      }
    ]
  },
  {
    id: 'textile_embroidery',
    name: 'Textile Machinery & Embroidery Works',
    gujaratiName: 'ટેક્સટાઇલ મશીનરી અને એમ્બ્રોઇડરી',
    hindiName: 'टेक्सटाइल मशीनरी व एम्ब्रॉयडरी',
    iconName: 'Shirt',
    popular: true,
    subcategories: [
      {
        id: 'textile_service',
        name: 'Embroidery & Loom Engineering',
        services: [
          'Multi-Head Computerized Embroidery Repair',
          'Jacquard Loom Controller Tuning',
          'Drop Wire & Spindle Alignment',
          'Rapier Loom Overhaul',
          'Yarn Tension Sensor Calibration',
          'Textile Motor & Inverter Drive Repair'
        ]
      }
    ]
  },
  {
    id: 'ca_gst_legal',
    name: 'CA, GST & Business Tax Consultants',
    gujaratiName: 'સી.એ., જીએસટી અને ટેક્સ કન્સલ્ટન્ટ',
    hindiName: 'सीए, जीएसटी व टैक्स कंसल्टेंट',
    iconName: 'Briefcase',
    popular: true,
    subcategories: [
      {
        id: 'tax_gst_filing',
        name: 'GST, ITR & Corporate Audit',
        services: [
          'Monthly GSTR-1 & 3B Return Filing',
          'Individual & Proprietor ITR Filing',
          'Private Limited & LLP Incorporation',
          'MSME Udyam & Gumastadhara Registration',
          'Gujarat State Industrial Subsidy Filing',
          'Statutory Financial Audit'
        ]
      }
    ]
  },
  {
    id: 'event_decor',
    name: 'Sound, Light & Garba Events',
    gujaratiName: 'સાઉન્ડ, લાઇટ અને ગરબા ઇવેન્ટ્સ',
    hindiName: 'साउंड, लाइट व गरबा इवेंट्स',
    iconName: 'Music',
    popular: true,
    subcategories: [
      {
        id: 'sound_event_service',
        name: 'Live Sound & Stage Production',
        services: [
          'Navratri Mega Line-Array Sound System',
          'P3/P4 LED Video Wall & Stage Trussing',
          'Live Ras-Garba Orchestra & Folk Singers',
          '4K Cinematic Drone & Multi-Camera Setup',
          'Laser Light Show & Cold Pyro FX',
          'Corporate AV Conference Setup'
        ]
      }
    ]
  },
  {
    id: 'interior_architect',
    name: 'Modular Kitchen & Interior Decor',
    gujaratiName: 'મોડ્યુલર કિચન અને ઇન્ટિરિયર ડેકોર',
    hindiName: 'मॉड्यूलर किचन व इंटीरियर डेकोर',
    iconName: 'Home',
    popular: true,
    subcategories: [
      {
        id: 'interior_service',
        name: 'Turnkey Living & Kitchen Interiors',
        services: [
          'German Acrylic & PU Modular Kitchen',
          'Termite-proof HDHMR Wardrobes',
          'False Ceiling Gypsum & Profile Lighting',
          'Custom CNC Jali & Fluted Wall Paneling',
          'Turnkey 2BHK/3BHK Villa Interior Planning'
        ]
      }
    ]
  },
  {
    id: 'hair_salon',
    name: 'Hair Salon & Men\'s Grooming',
    gujaratiName: 'વાળ સલૂન અને મેન્સ ગ્રુમિંગ',
    hindiName: 'हेयर सैलून व ग्रूमिंग',
    iconName: 'Scissors',
    popular: true,
    subcategories: [
      {
        id: 'mens_styling',
        name: 'Haircut, Beard & Spa',
        services: [
          'Executive Haircut & Styling',
          'Beard Trim, Fade & Razor Shave',
          'Head Massage with Ayurvedic Oil',
          'Keratin & Hair Smoothening',
          'Charcoal D-Tan Facial',
          'Groom Wedding Makeover'
        ]
      }
    ]
  },
  {
    id: 'beauty_parlour',
    name: 'Beauty Parlour & Bridal Studio',
    gujaratiName: 'બ્યુટી પાર્લર અને બ્રાઇડલ સ્ટુડિયો',
    hindiName: 'ब्यूटी पार्लर व ब्राइडल स्टूडियो',
    iconName: 'Sparkles',
    popular: true,
    subcategories: [
      {
        id: 'bridal_beauty',
        name: 'Bridal Makeup, Skin & Hair',
        services: [
          'HD Bridal Makeup & Hairdo',
          'O3+ & Gold Radiance Facial',
          'Rica Waxing & Eyebrow Threading',
          'Manicure, Pedicure & Nail Art',
          'Hair Botox & Moroccan Spa',
          'Traditional Gujarati Mehndi Art'
        ]
      }
    ]
  },
  {
    id: 'tea_stall',
    name: 'Tea Stall & Chai Tapri',
    gujaratiName: 'ચા ની કીટલી અને ટી સ્ટોલ',
    hindiName: 'चाय टपरी व टी स्टॉल',
    iconName: 'Coffee',
    popular: true,
    subcategories: [
      {
        id: 'chai_snacks',
        name: 'Traditional Kadak Chai & Snacks',
        services: [
          'Gujarat Special Masala Kadak Chai',
          'Adrak Elaichi Kulhad Tea',
          'Fresh Bun Maska & Brun Butter',
          'Maskabun & Hot Bournvita',
          'Corporate Office Morning Tea Flasks',
          'Piping Hot Samosa & Puff'
        ]
      }
    ]
  },
  {
    id: 'pan_parlour',
    name: 'Pan Parlour & Mukhwas',
    gujaratiName: 'પાન પાર્લર અને મુખવાસ',
    hindiName: 'पान पार्लर व मुखवास',
    iconName: 'Leaf',
    popular: true,
    subcategories: [
      {
        id: 'pan_mukhwas',
        name: 'Royal Pan, Mukhwas & Beverages',
        services: [
          'Calcutta Meetha Special Pan',
          'Banarasi Maghai Sada Pan',
          'Chocolate & Fire Ice Pan',
          'Rajwadi Roasted Dhana Dal & Mukhwas',
          'Cold Soft Drinks, Lassi & Ice Creams',
          'Party Order Sweet Pan Hampers'
        ]
      }
    ]
  },
  {
    id: 'clinic',
    name: 'Doctor Clinic & Dispensary',
    gujaratiName: 'ડોક્ટર ક્લિનિક અને દવાખાનું',
    hindiName: 'डॉक्टर क्लिनिक व डिस्पेंसरी',
    iconName: 'Stethoscope',
    popular: true,
    subcategories: [
      {
        id: 'opd_consultation',
        name: 'General Medicine & Family Physician',
        services: [
          'General OPD Health Checkup',
          'Digital Blood Pressure & Sugar Testing',
          'Viral Fever, Cold & Infection Care',
          'Pediatric Child Health Examination',
          'Emergency Nebulization & Wound Dressing',
          'Preventive Health Screening Consultation'
        ]
      }
    ]
  },
  {
    id: 'medical_store',
    name: 'Medical Store & Pharmacy',
    gujaratiName: 'મેડિકલ સ્ટોર અને ફાર્મસી',
    hindiName: 'मेडिकल स्टोर व फार्मेसी',
    iconName: 'Pill',
    popular: true,
    subcategories: [
      {
        id: 'pharmacy_supplies',
        name: '24/7 Medicines & Healthcare Goods',
        services: [
          '24/7 Prescription Allopathic Medicines',
          'Affordable Jan Aushadhi Generic Drugs',
          'Rapid Doorstep Medicine Delivery',
          'Baby Diapers, Cerelac & Infant Care',
          'BP Monitors & Digital Thermometers',
          'Orthopedic Knee Belts & Wheelchairs'
        ]
      }
    ]
  },
  {
    id: 'hospital',
    name: 'Hospital & Multi-Speciality',
    gujaratiName: 'હોસ્પિટલ અને મલ્ટી-સ્પેશિયાલિટી',
    hindiName: 'अस्पताल व मल्टी-स्पेशियलिटी',
    iconName: 'HeartPulse',
    popular: true,
    subcategories: [
      {
        id: 'emergency_surgery',
        name: '24/7 Emergency, ICU & Inpatient',
        services: [
          '24/7 Trauma, Accident & ICU Support',
          'General Laparoscopic & Ortho Surgeries',
          'Maternity, Normal & C-Section Delivery',
          'Digital X-Ray, Sonography & CT Scan',
          'Ayushman PMJAY Cashless & TPA Mediclaim',
          '24-Hour Advanced Cardiac Ambulance'
        ]
      }
    ]
  },
  {
    id: 'college',
    name: 'College & Higher Education',
    gujaratiName: 'કોલેજ અને ઉચ્ચ શિક્ષણ',
    hindiName: 'कॉलेज व उच्च शिक्षा',
    iconName: 'GraduationCap',
    popular: true,
    subcategories: [
      {
        id: 'higher_degrees',
        name: 'Degrees, Professional & Diploma Courses',
        services: [
          'B.Tech / BE Engineering & Diploma',
          'B.Com, BBA & MBA Management Degree',
          'BCA & MCA Computer Applications',
          'B.Sc, M.Sc & B.Pharm Pharmacy',
          'Campus Placement Cell & MNC Hiring',
          'Air-Conditioned Library & Hostel Facilities'
        ]
      }
    ]
  },
  {
    id: 'school',
    name: 'School (CBSE, GSEB & ICSE)',
    gujaratiName: 'શાળા અને સ્કૂલ',
    hindiName: 'स्कूल (सीबीएसई व जीएसईबी)',
    iconName: 'School',
    popular: true,
    subcategories: [
      {
        id: 'k12_education',
        name: 'Primary, Secondary & Higher Secondary',
        services: [
          'English & Gujarati Medium Instruction',
          'Interactive Smart Interactive Classrooms',
          'Robotics, AI & Modern Science Labs',
          'Cricket, Football & Athletics Coaching',
          'GPS-Tracked Safe School Bus Network',
          'Board Exam Merit Mentorship & Olympiad Prep'
        ]
      }
    ]
  },
  {
    id: 'kindergarten',
    name: 'Kindergarten & Pre-School',
    gujaratiName: 'કિન્ડરગાર્ટન અને પ્રી-સ્કૂલ',
    hindiName: 'किंडरगार्टन व प्री-स्कूल',
    iconName: 'Smile',
    popular: true,
    subcategories: [
      {
        id: 'early_learning',
        name: 'Nursery, Junior & Senior KG',
        services: [
          'Phonics & Jolly Phonics Reading',
          'Montessori Play-Way Mathematics',
          'Color, Craft & Clay Modeling Studio',
          'Child-Proof Padded Classrooms',
          'Stage Speaking & Confidence Building',
          'Safe Doorstep Van Pick & Drop'
        ]
      }
    ]
  },
  {
    id: 'playgroup',
    name: 'Playgroup & Daycare',
    gujaratiName: 'પ્લેગ્રુપ અને ડેકેર સેન્ટર',
    hindiName: 'प्लेग्रुप व डेकेयर',
    iconName: 'Baby',
    popular: true,
    subcategories: [
      {
        id: 'infant_toddler_care',
        name: 'Toddler Play & Working Parent Daycare',
        services: [
          'Toddler Sensory & Motor Skill Play (1.5 - 3 Yrs)',
          'Full-Day & Flexible Working Hours Daycare',
          'Live CCTV Mother Access via Mobile App',
          'Fresh Homestyle Hygienic Meals & Milk',
          'Gentle Potty Training & Clean Sleeping Beds',
          'Music, Rhymes & Social Interaction'
        ]
      }
    ]
  },
  {
    id: 'bakery_sweets',
    name: 'Bakery & Sweet Mart',
    gujaratiName: 'બેકરી અને સ્વીટ માર્ટ',
    hindiName: 'बेकरी व स्वीट मार्ट',
    iconName: 'Cake',
    popular: false,
    subcategories: [
      {
        id: 'sweets_cakes',
        name: 'Fresh Cakes, Pastries & Gujarati Mithai',
        services: [
          '100% Eggless Custom Birthday Cakes',
          'Fresh Kaju Katli, Mohanthal & Peda',
          'Oven-fresh Cookies, Puffs & Croissants',
          'Sugar-Free Sweets for Diabetics',
          'Wedding Mawa & Dryfruit Gift Boxes'
        ]
      }
    ]
  },
  {
    id: 'pathology_lab',
    name: 'Pathology Lab & Diagnostic',
    gujaratiName: 'પેથોલોજી લેબ અને બ્લડ ટેસ્ટ',
    hindiName: 'पैथोलॉजी लैब व जांच केंद्र',
    iconName: 'Activity',
    popular: false,
    subcategories: [
      {
        id: 'diagnostic_tests',
        name: 'Blood Tests & Health Checkups',
        services: [
          'Free Doorstep Home Blood Sample Collection',
          'Full Body Health Checkup Packages (60+ Tests)',
          'CBC, Lipid Profile, Thyroid & HbA1c',
          'Same-Day WhatsApp Digital Reports',
          'NABL Accredited Automated Lab Testing'
        ]
      }
    ]
  }
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'patel-electrical-satellite',
    businessName: 'Patel Electrical Services & Solar',
    ownerName: 'Bhavik Patel',
    phone: '+91 98250 14892',
    whatsapp: '919825014892',
    email: 'bhavik@patelelectricals.in',
    categoryId: 'electrician',
    subcategoryId: 'home_electrician',
    services: [
      'Wiring & Rewiring',
      'Switchboard Repair',
      'Fan Installation',
      'Solar Inverter Maintenance',
      'MCB Tripping Fault'
    ],
    state: 'Gujarat',
    city: 'Ahmedabad',
    area: 'Satellite',
    address: 'Shop 14, Ground Floor, Radhe Arcade, Satellite Road',
    pincode: '380015',
    lat: 23.0298,
    lng: 72.5284,
    description: "Government Licensed 'A' Class electrical contractor serving Satellite, Vastrapur, and Western Ahmedabad. Specializing in rapid 30-minute doorstep service, concealed house rewiring, MCB trip diagnostics, and rooftop solar connections.",
    experienceYears: 12,
    startingPrice: 199,
    rating: 4.9,
    reviewCount: 48,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '08:00',
      closeTime: '22:00',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4',
    stats: {
      views: 1420,
      calls: 310,
      whatsapp: 184,
      directions: 142,
      qrScans: 96,
      enquiries: 64,
      totalEarnings: 38400
    },
    qrToken: 'VBV-GUJ-AHM-001',
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'surat-cool-point-adajan',
    businessName: 'Surat Cool Point AC & Refrigeration',
    ownerName: 'Alpesh Vaghani',
    phone: '+91 98982 45120',
    whatsapp: '919898245120',
    email: 'contact@suratcoolpoint.in',
    categoryId: 'ac_services',
    subcategoryId: 'ac_repair',
    services: [
      'Deep Foam Jet Cleaning',
      'Gas Refilling (R32 / R410)',
      'Compressor Overhaul',
      'Split AC Installation'
    ],
    state: 'Gujarat',
    city: 'Surat',
    area: 'Adajan',
    address: '102, Shivalik Complex, Near Star Bazaar, Adajan Hazira Road',
    pincode: '395009',
    lat: 21.1959,
    lng: 72.7933,
    description: 'Leading AC repair and jet pump washing specialist in Surat. Serving Adajan, Vesu, and Pal with genuine OEM copper piping, eco gas refilling, and warranty on all compressor repairs.',
    experienceYears: 9,
    startingPrice: 349,
    rating: 4.8,
    reviewCount: 36,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '08:30',
      closeTime: '21:30',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-technician-checking-the-wiring-of-an-air-conditioner-41585-large.mp4',
    stats: {
      views: 980,
      calls: 215,
      whatsapp: 142,
      directions: 88,
      qrScans: 62,
      enquiries: 45,
      totalEarnings: 29500
    },
    qrToken: 'VBV-GUJ-SUR-002',
    createdAt: '2025-01-14T09:30:00Z'
  },
  {
    id: 'shreeji-plumbing-alkapuri',
    businessName: 'Shreeji Plumbing & Sanitary Works',
    ownerName: 'Jignesh Shah',
    phone: '+91 94260 78219',
    whatsapp: '919426078219',
    email: 'jignesh@shreejiplumbing.com',
    categoryId: 'plumber',
    subcategoryId: 'home_plumbing',
    services: [
      'Tap & Faucet Repair',
      'Bathroom Fitting',
      'Water Tank Cleaning',
      'Drainage Blockage Clearing',
      'Pipeline Leakage Fixing'
    ],
    state: 'Gujarat',
    city: 'Vadodara',
    area: 'Alkapuri',
    address: '7, Yashkamal Building, Opposite Railway Station, Alkapuri',
    pincode: '390007',
    lat: 22.3106,
    lng: 73.1704,
    description: 'Expert residential and commercial plumbing team in Vadodara. Specialized motorized drain de-clogging, high-pressure pump setup, and sanitary fixture restoration.',
    experienceYears: 15,
    startingPrice: 149,
    rating: 4.9,
    reviewCount: 52,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: false,
    businessHours: {
      days: 'Mon - Sat',
      openTime: '08:00',
      closeTime: '21:00',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542013936693-884638332954?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-plumber-tightening-a-pipe-with-a-wrench-41588-large.mp4',
    stats: {
      views: 740,
      calls: 182,
      whatsapp: 96,
      directions: 54,
      qrScans: 40,
      enquiries: 38,
      totalEarnings: 21800
    },
    qrToken: 'VBV-GUJ-BRD-003',
    createdAt: '2025-01-20T11:15:00Z'
  },
  {
    id: 'somnath-carpenter-rajkot',
    businessName: 'Somnath Wood Art & Carpenter',
    ownerName: 'Mansukhbhai Suthar',
    phone: '+91 97123 90455',
    whatsapp: '919712390455',
    email: 'info@somnathwoodart.com',
    categoryId: 'carpenter',
    subcategoryId: 'furniture_repair',
    services: [
      'Door Lock & Hinge Fitting',
      'Bed & Wardrobe Assembly',
      'Modular Kitchen Repair',
      'Custom Woodwork'
    ],
    state: 'Gujarat',
    city: 'Rajkot',
    area: 'Kalawad Road',
    address: 'Plot 22, Near Kotecha Chowk, Kalawad Road',
    pincode: '360005',
    lat: 22.2858,
    lng: 70.7712,
    description: 'Traditional Gujarati master craftsmanship combined with modern hardware fittings. Hydraulic bed repair, custom plywood wardrobes, sliding door track maintenance, and lock upgrades.',
    experienceYears: 18,
    startingPrice: 249,
    rating: 4.7,
    reviewCount: 29,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '09:00',
      closeTime: '20:30',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-carpenter-measuring-a-piece-of-wood-41587-large.mp4',
    stats: {
      views: 590,
      calls: 135,
      whatsapp: 84,
      directions: 42,
      qrScans: 28,
      enquiries: 24,
      totalEarnings: 17500
    },
    qrToken: 'VBV-GUJ-RJK-004',
    createdAt: '2025-02-01T14:00:00Z'
  },
  {
    id: 'swachh-gujarat-vastrapur',
    businessName: 'Swachh Gujarat Deep Cleaning & Pest Control',
    ownerName: 'Hiren Dave',
    phone: '+91 99090 32188',
    whatsapp: '919909032188',
    email: 'service@swachhgujarat.in',
    categoryId: 'cleaning',
    subcategoryId: 'home_cleaning',
    services: [
      'Full House Deep Cleaning',
      'Bathroom Disinfection',
      'Kitchen Degreasing',
      'Termite (ઉધઈ) Treatment'
    ],
    state: 'Gujarat',
    city: 'Ahmedabad',
    area: 'Vastrapur',
    address: 'B-204, Safal Profitaire, Corporate Road, Vastrapur',
    pincode: '380015',
    lat: 23.0350,
    lng: 72.5293,
    description: 'Eco-safe hospital grade chemical deep cleaning and odorless pest control across Ahmedabad & Gandhinagar. Sofa shampooing, kitchen chimney cleaning, and 5-year termite warranty.',
    experienceYears: 7,
    startingPrice: 499,
    rating: 4.9,
    reviewCount: 41,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '07:30',
      closeTime: '21:00',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cleaning-the-floor-with-a-mop-41586-large.mp4',
    stats: {
      views: 1120,
      calls: 260,
      whatsapp: 175,
      directions: 95,
      qrScans: 78,
      enquiries: 52,
      totalEarnings: 33400
    },
    qrToken: 'VBV-GUJ-AHM-005',
    createdAt: '2025-02-05T08:00:00Z'
  },
  {
    id: 'aquapure-ro-navrangpura',
    businessName: 'AquaPure RO Water Technology',
    ownerName: 'Pratik Mevada',
    phone: '+91 98241 55677',
    whatsapp: '919824155677',
    email: 'pratik@aquapuregujarat.in',
    categoryId: 'ro_purifier',
    subcategoryId: 'ro_service',
    services: [
      'Annual RO Service (Filter Change)',
      'Membrane Replacement',
      'TDS Balancing',
      'Commercial RO Plant'
    ],
    state: 'Gujarat',
    city: 'Ahmedabad',
    area: 'Navrangpura',
    address: 'GF-4, City Center, Swastik Cross Road, Navrangpura',
    pincode: '380009',
    lat: 23.0373,
    lng: 72.5613,
    description: 'Certified drinking water technicians. Free digital TDS testing at your doorstep. We service all brands including Kent, Aquaguard, Pureit, and commercial alkaline plants.',
    experienceYears: 10,
    startingPrice: 299,
    rating: 4.8,
    reviewCount: 33,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: false,
    businessHours: {
      days: 'Mon - Sat',
      openTime: '09:00',
      closeTime: '21:00',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4',
    stats: {
      views: 860,
      calls: 194,
      whatsapp: 110,
      directions: 62,
      qrScans: 45,
      enquiries: 39,
      totalEarnings: 24700
    },
    qrToken: 'VBV-GUJ-AHM-006',
    createdAt: '2025-02-12T12:00:00Z'
  },
  {
    id: 'suryashakti-solar-ahmedabad',
    businessName: 'Surya Shakti Solar Solutions',
    ownerName: 'Dharmesh Joshi',
    phone: '+91 98254 99120',
    whatsapp: '919825499120',
    email: 'dharmesh@suryashaktisolar.in',
    categoryId: 'solar_energy',
    subcategoryId: 'residential_solar',
    services: [
      'Surya Gujarat Scheme Subsidy Setup',
      'On-Grid Inverter Installation',
      'Net Metering Approval Liaison',
      'Bi-directional Meter Testing',
      'Solar Panel High-Pressure Foam Cleaning'
    ],
    state: 'Gujarat',
    city: 'Ahmedabad',
    area: 'SG Highway',
    address: '402, Pinnacle Business Park, Corporate Road, Prahlad Nagar / SG Highway',
    pincode: '380051',
    lat: 23.0125,
    lng: 72.5085,
    description: 'Empaneled Gujarat solar contractor under PM Surya Ghar & Surya Gujarat Scheme. Over 650+ residential rooftops energized across Ahmedabad & Gandhinagar with 25-year panel performance warranty and fast DISCOM net metering clearance.',
    experienceYears: 11,
    startingPrice: 499,
    rating: 4.9,
    reviewCount: 64,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sat',
      openTime: '08:30',
      closeTime: '20:30',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1508873696983-2df570464753?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1508873696983-2df570464753?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508873696983-2df570464753?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4',
    stats: {
      views: 1820,
      calls: 380,
      whatsapp: 240,
      directions: 160,
      qrScans: 112,
      enquiries: 88,
      totalEarnings: 82000
    },
    qrToken: 'VBV-GUJ-SOLAR-007',
    createdAt: '2025-01-08T09:00:00Z'
  },
  {
    id: 'radhe-krishna-caterers-rajkot',
    businessName: 'Radhe Krishna Royal Caterers & Mandap',
    ownerName: 'Hasmukhbhai Bhalodiya',
    phone: '+91 94282 30190',
    whatsapp: '919428230190',
    email: 'info@radhekrishnacaterers.com',
    categoryId: 'catering_farsan',
    subcategoryId: 'wedding_catering',
    services: [
      'Traditional Gujarati & Kathiyawadi Thali',
      'Pure Jain & Swaminarayan Cooking',
      'Live Farsan Counter (Jalebi, Fafda, Khaman)',
      'Royal Reception Buffet',
      'Traditional Wooden Mandap & Chori'
    ],
    state: 'Gujarat',
    city: 'Rajkot',
    area: 'Kalawad Road',
    address: 'Shreeji Krupa, Near Kotecha Chowk, Kalawad Road',
    pincode: '360005',
    lat: 22.2872,
    lng: 70.7745,
    description: 'Renowned wedding and community caterers of Saurashtra. Authentic pure ghee Gujarati sweets, live wood-fired rotla & kathiyawadi rasavada, hygienic live counters, and grand royal royal wedding mandap decor.',
    experienceYears: 22,
    startingPrice: 299,
    rating: 4.9,
    reviewCount: 92,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '07:00',
      closeTime: '23:00',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cleaning-the-floor-with-a-mop-41586-large.mp4',
    stats: {
      views: 2150,
      calls: 460,
      whatsapp: 320,
      directions: 185,
      qrScans: 140,
      enquiries: 110,
      totalEarnings: 94000
    },
    qrToken: 'VBV-GUJ-FOOD-008',
    createdAt: '2025-01-05T08:00:00Z'
  },
  {
    id: 'kohinoor-diamond-surat',
    businessName: 'Kohinoor Diamond & Gold Studio',
    ownerName: 'Tushar Chodvadiya',
    phone: '+91 97270 41188',
    whatsapp: '919727041188',
    email: 'tushar@kohinoordiamonds.in',
    categoryId: 'diamond_jewelry',
    subcategoryId: 'gold_diamond_service',
    services: [
      'Ultrasonic Gold & Diamond Cleaning',
      'Laser Stone Setting & Prong Repair',
      'Ring Resizing & Soldering',
      'Rhodium & Antique Matte Polish',
      'BIS Hallmark Testing Assistance'
    ],
    state: 'Gujarat',
    city: 'Surat',
    area: 'Varachha',
    address: 'Shop 108, Mini Bazaar Diamond Market, Varachha Main Road',
    pincode: '395006',
    lat: 21.2185,
    lng: 72.8532,
    description: "Located in Surat's world-famous Varachha diamond district. Master micro-prong laser setting, natural CVD diamond testing, high-luster Italian rhodium finishing, and on-the-spot ultrasonic jewelry rejuvenation with zero gold loss.",
    experienceYears: 16,
    startingPrice: 199,
    rating: 4.9,
    reviewCount: 58,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sat',
      openTime: '10:00',
      closeTime: '20:30',
      isOpenToday: true
    },
    serviceAtCustomerLocation: false,
    logoUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4',
    stats: {
      views: 1640,
      calls: 285,
      whatsapp: 195,
      directions: 130,
      qrScans: 85,
      enquiries: 54,
      totalEarnings: 42000
    },
    qrToken: 'VBV-GUJ-GEM-009',
    createdAt: '2025-01-18T10:30:00Z'
  },
  {
    id: 'ambica-textile-katargam',
    businessName: 'Ambica Textile Machinery & Spares',
    ownerName: 'Pareshbhai Dobariya',
    phone: '+91 98251 77633',
    whatsapp: '919825177633',
    email: 'service@ambicatextilesurat.com',
    categoryId: 'textile_embroidery',
    subcategoryId: 'textile_service',
    services: [
      'Multi-Head Computerized Embroidery Repair',
      'Jacquard Loom Controller Tuning',
      'Drop Wire & Spindle Alignment',
      'Rapier Loom Overhaul',
      'Textile Motor & Inverter Drive Repair'
    ],
    state: 'Gujarat',
    city: 'Surat',
    area: 'Katargam',
    address: 'GIDC Industrial Estate, Near Gajera Circle, Katargam',
    pincode: '395004',
    lat: 21.2312,
    lng: 72.8290,
    description: 'Dedicated textile loom, computerized multi-head embroidery, and circular knitting machine engineering service. Stockist of high-precision Japanese rotary hooks, servo motor drives, and rapid break-down response.',
    experienceYears: 19,
    startingPrice: 399,
    rating: 4.8,
    reviewCount: 47,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: false,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '08:00',
      closeTime: '21:00',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-technician-checking-the-wiring-of-an-air-conditioner-41585-large.mp4',
    stats: {
      views: 1290,
      calls: 310,
      whatsapp: 180,
      directions: 90,
      qrScans: 60,
      enquiries: 42,
      totalEarnings: 37500
    },
    qrToken: 'VBV-GUJ-TEX-010',
    createdAt: '2025-01-22T11:00:00Z'
  },
  {
    id: 'parikh-ca-associates-vadodara',
    businessName: 'Parikh & Associates CA & Tax Advisory',
    ownerName: 'CA Parthiv Parikh',
    phone: '+91 98795 23411',
    whatsapp: '919879523411',
    email: 'ca.parthiv@parikhassociates.in',
    categoryId: 'ca_gst_legal',
    subcategoryId: 'tax_gst_filing',
    services: [
      'Monthly GSTR-1 & 3B Return Filing',
      'Individual & Proprietor ITR Filing',
      'Private Limited & LLP Incorporation',
      'MSME Udyam & Gumastadhara Registration',
      'Statutory Financial Audit'
    ],
    state: 'Gujarat',
    city: 'Vadodara',
    area: 'Alkapuri',
    address: '304, Windsor Plaza, RC Dutt Road, Alkapuri',
    pincode: '390007',
    lat: 22.3120,
    lng: 73.1685,
    description: 'Senior Chartered Accountant firm providing digital GST compliance, faceless tax assessment representation, startup entity incorporation, MSME subsidies, and corporate tax structuring for Gujarat enterprises.',
    experienceYears: 14,
    startingPrice: 499,
    rating: 4.9,
    reviewCount: 51,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sat',
      openTime: '09:30',
      closeTime: '19:30',
      isOpenToday: true
    },
    serviceAtCustomerLocation: false,
    logoUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4',
    stats: {
      views: 1410,
      calls: 245,
      whatsapp: 165,
      directions: 110,
      qrScans: 72,
      enquiries: 48,
      totalEarnings: 36000
    },
    qrToken: 'VBV-GUJ-TAX-011',
    createdAt: '2025-01-25T14:00:00Z'
  },
  {
    id: 'chamunda-sound-gandhinagar',
    businessName: 'Chamunda Sound & Navratri Event Production',
    ownerName: 'Jaydeepsinh Vaghela',
    phone: '+91 99252 88470',
    whatsapp: '919925288470',
    email: 'jaydeep@chamundasound.com',
    categoryId: 'event_decor',
    subcategoryId: 'sound_event_service',
    services: [
      'Navratri Mega Line-Array Sound System',
      'P3/P4 LED Video Wall & Stage Trussing',
      'Live Ras-Garba Orchestra & Folk Singers',
      '4K Cinematic Drone & Multi-Camera Setup',
      'Laser Light Show & Cold Pyro FX'
    ],
    state: 'Gujarat',
    city: 'Gandhinagar',
    area: 'Kudasan',
    address: 'Near Swagat Holiday Mall, Kudasan Main Road',
    pincode: '382421',
    lat: 23.1895,
    lng: 72.6315,
    description: 'State-of-the-art live audio and festival stage engineering. High-power JBL and RCF line arrays, calibrated acoustic management for Garba grounds, waterproof canopy stages, and intelligent beam laser setups.',
    experienceYears: 15,
    startingPrice: 999,
    rating: 4.9,
    reviewCount: 76,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '08:00',
      closeTime: '23:30',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cleaning-the-floor-with-a-mop-41586-large.mp4',
    stats: {
      views: 2450,
      calls: 510,
      whatsapp: 390,
      directions: 210,
      qrScans: 165,
      enquiries: 125,
      totalEarnings: 115000
    },
    qrToken: 'VBV-GUJ-EVT-012',
    createdAt: '2025-01-12T16:00:00Z'
  },
  {
    id: 'maruti-modular-kitchen-surat',
    businessName: 'Maruti Smart Interior & Modular Kitchen',
    ownerName: 'Manojbhai Patel',
    phone: '+91 98980 65123',
    whatsapp: '919898065123',
    email: 'maruti.interiors@gmail.com',
    categoryId: 'interior_architect',
    subcategoryId: 'interior_service',
    services: [
      'German Acrylic & PU Modular Kitchen',
      'Termite-proof HDHMR Wardrobes',
      'False Ceiling Gypsum & Profile Lighting',
      'Custom CNC Jali & Fluted Wall Paneling',
      'Turnkey 2BHK/3BHK Villa Interior Planning'
    ],
    state: 'Gujarat',
    city: 'Surat',
    area: 'Vesu',
    address: '201, Rajhans Montessa, VIP Road, Vesu',
    pincode: '395007',
    lat: 21.1465,
    lng: 72.7758,
    description: 'Factory-finish German Blum & Hettich hardware modular kitchens. Termite-proof water-resistant HDHMR boards, 10-year warranty, 3D photorealistic design preview before fabrication, and on-time 30-day handover.',
    experienceYears: 13,
    startingPrice: 799,
    rating: 4.8,
    reviewCount: 39,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: false,
    businessHours: {
      days: 'Mon - Sat',
      openTime: '10:00',
      closeTime: '20:00',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-carpenter-measuring-a-piece-of-wood-41587-large.mp4',
    stats: {
      views: 1180,
      calls: 210,
      whatsapp: 145,
      directions: 95,
      qrScans: 58,
      enquiries: 38,
      totalEarnings: 31000
    },
    qrToken: 'VBV-GUJ-INT-013',
    createdAt: '2025-02-02T13:00:00Z'
  },
  {
    id: 'habibs-hair-salon-satellite',
    businessName: 'Habibs Hair Salon & Men\'s Grooming',
    ownerName: 'Sunil Limbachiya',
    phone: '+91 98256 31209',
    whatsapp: '919825631209',
    email: 'sunil@habibssalon.in',
    categoryId: 'hair_salon',
    subcategoryId: 'mens_styling',
    services: [
      'Executive Haircut & Styling',
      'Beard Trim, Fade & Razor Shave',
      'Head Massage with Ayurvedic Oil',
      'Keratin & Hair Smoothening',
      'Groom Wedding Makeover'
    ],
    state: 'Gujarat',
    city: 'Ahmedabad',
    area: 'Satellite',
    address: 'GF-3, Titanium City Center, 100 Feet Anandnagar Road, Satellite',
    pincode: '380015',
    lat: 23.0182,
    lng: 72.5210,
    description: 'Premier air-conditioned hair styling studio in Satellite. Trained master barbers, hygienic single-use sterilized kits, customized beard fades, scalp ozone therapy, and complete groom pre-wedding packages.',
    experienceYears: 14,
    startingPrice: 199,
    rating: 4.9,
    reviewCount: 88,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '09:00',
      closeTime: '22:00',
      isOpenToday: true
    },
    serviceAtCustomerLocation: false,
    logoUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4',
    stats: {
      views: 1940,
      calls: 380,
      whatsapp: 210,
      directions: 165,
      qrScans: 120,
      enquiries: 74,
      totalEarnings: 45000
    },
    qrToken: 'VBV-GUJ-HAIR-014',
    createdAt: '2025-01-10T11:00:00Z'
  },
  {
    id: 'roopkala-beauty-parlour-adajan',
    businessName: 'Roopkala Beauty Parlour & Bridal Studio',
    ownerName: 'Daksha Ben Patel',
    phone: '+91 97241 80922',
    whatsapp: '919724180922',
    email: 'roopkalasurat@gmail.com',
    categoryId: 'beauty_parlour',
    subcategoryId: 'bridal_beauty',
    services: [
      'HD Bridal Makeup & Hairdo',
      'O3+ & Gold Radiance Facial',
      'Rica Waxing & Eyebrow Threading',
      'Manicure, Pedicure & Nail Art',
      'Traditional Gujarati Mehndi Art'
    ],
    state: 'Gujarat',
    city: 'Surat',
    area: 'Adajan',
    address: '104, Western Arena, Near Green City, Adajan-Pal Road',
    pincode: '395009',
    lat: 21.1980,
    lng: 72.7890,
    description: 'Surat\'s beloved bridal and party makeover studio. Certified international bridal makeup artists, skin radiance facials, pain-free organic waxing, and customized pre-wedding packages for brides and bridesmaids.',
    experienceYears: 18,
    startingPrice: 249,
    rating: 4.9,
    reviewCount: 96,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '10:00',
      closeTime: '20:30',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cleaning-the-floor-with-a-mop-41586-large.mp4',
    stats: {
      views: 2200,
      calls: 490,
      whatsapp: 340,
      directions: 190,
      qrScans: 145,
      enquiries: 98,
      totalEarnings: 68000
    },
    qrToken: 'VBV-GUJ-BEAUTY-015',
    createdAt: '2025-01-12T10:00:00Z'
  },
  {
    id: 'waghbakri-tea-stall-navrangpura',
    businessName: 'Wagh Bakri & Shambhu\'s Kadak Chai Kitli',
    ownerName: 'Chetanbhai Rabari',
    phone: '+91 99092 14389',
    whatsapp: '919909214389',
    email: 'chai.navrangpura@gmail.com',
    categoryId: 'tea_stall',
    subcategoryId: 'chai_snacks',
    services: [
      'Gujarat Special Masala Kadak Chai',
      'Adrak Elaichi Kulhad Tea',
      'Fresh Bun Maska & Brun Butter',
      'Maskabun & Hot Bournvita',
      'Corporate Office Morning Tea Flasks'
    ],
    state: 'Gujarat',
    city: 'Ahmedabad',
    area: 'Navrangpura',
    address: 'Opposite Gujarat University Library, University Road, Navrangpura',
    pincode: '380009',
    lat: 23.0360,
    lng: 72.5480,
    description: 'Iconic Gujarat University student and corporate hub. Brewing pure milk slow-boiled ginger cardamom Kadak chai with fresh Amul butter bun maska. Daily corporate flask supply to surrounding banks and IT offices.',
    experienceYears: 16,
    startingPrice: 20,
    rating: 4.8,
    reviewCount: 142,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '06:00',
      closeTime: '23:45',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cleaning-the-floor-with-a-mop-41586-large.mp4',
    stats: {
      views: 3100,
      calls: 640,
      whatsapp: 410,
      directions: 320,
      qrScans: 280,
      enquiries: 140,
      totalEarnings: 52000
    },
    qrToken: 'VBV-GUJ-CHAI-016',
    createdAt: '2025-01-05T06:00:00Z'
  },
  {
    id: 'shreeji-pan-parlour-rajkot',
    businessName: 'Shreeji Premium Pan Parlour & Mukhwas',
    ownerName: 'Vipulbhai Chudasama',
    phone: '+91 98242 55018',
    whatsapp: '919824255018',
    email: 'shreejipanrajkot@gmail.com',
    categoryId: 'pan_parlour',
    subcategoryId: 'pan_mukhwas',
    services: [
      'Calcutta Meetha Special Pan',
      'Banarasi Maghai Sada Pan',
      'Chocolate & Fire Ice Pan',
      'Rajwadi Roasted Dhana Dal & Mukhwas',
      'Cold Soft Drinks, Lassi & Ice Creams'
    ],
    state: 'Gujarat',
    city: 'Rajkot',
    area: 'Kalawad Road',
    address: 'Opp. Kotecha Girls High School, Kalawad Road',
    pincode: '360005',
    lat: 22.2890,
    lng: 70.7760,
    description: 'Rajkot\'s prestigious post-dinner family destination. Famous for sweet Calcutta Meetha pan wrapped with authentic silver vark, fresh gulkand, natural khus, and 40+ varieties of hand-roasted Gujarati mukhwas.',
    experienceYears: 20,
    startingPrice: 30,
    rating: 4.9,
    reviewCount: 115,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '08:00',
      closeTime: '00:30',
      isOpenToday: true
    },
    serviceAtCustomerLocation: false,
    logoUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cleaning-the-floor-with-a-mop-41586-large.mp4',
    stats: {
      views: 2400,
      calls: 310,
      whatsapp: 220,
      directions: 240,
      qrScans: 190,
      enquiries: 65,
      totalEarnings: 38000
    },
    qrToken: 'VBV-GUJ-PAN-017',
    createdAt: '2025-01-08T08:00:00Z'
  },
  {
    id: 'aayush-clinic-alkapuri',
    businessName: 'Aayush Family Physician Clinic & Daycare',
    ownerName: 'Dr. Nirav Shah (MBBS, MD)',
    phone: '+91 94265 89201',
    whatsapp: '919426589201',
    email: 'dr.nirav@aayushclinic.in',
    categoryId: 'clinic',
    subcategoryId: 'opd_consultation',
    services: [
      'General OPD Health Checkup',
      'Digital Blood Pressure & Sugar Testing',
      'Viral Fever, Cold & Infection Care',
      'Pediatric Child Health Examination',
      'Emergency Nebulization & Wound Dressing'
    ],
    state: 'Gujarat',
    city: 'Vadodara',
    area: 'Alkapuri',
    address: '102, Shreem Shalimar Complex, RC Dutt Road, Alkapuri',
    pincode: '390007',
    lat: 22.3140,
    lng: 73.1670,
    description: 'Trusted family medical practice in central Vadodara. Experienced physician providing thorough consultation, chronic diabetes & hypertension monitoring, vaccination, pediatric care, and quick digital prescriptions.',
    experienceYears: 17,
    startingPrice: 300,
    rating: 4.9,
    reviewCount: 78,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sat',
      openTime: '09:00',
      closeTime: '21:00',
      isOpenToday: true
    },
    serviceAtCustomerLocation: false,
    logoUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4',
    stats: {
      views: 1850,
      calls: 420,
      whatsapp: 280,
      directions: 170,
      qrScans: 110,
      enquiries: 85,
      totalEarnings: 62000
    },
    qrToken: 'VBV-GUJ-MED-018',
    createdAt: '2025-01-15T09:00:00Z'
  },
  {
    id: 'sanjivani-medical-vastrapur',
    businessName: 'Sanjivani 24/7 Medical Store & Pharmacy',
    ownerName: 'Manishbhai Soni',
    phone: '+91 98980 77124',
    whatsapp: '919898077124',
    email: 'sanjivani.ahmedabad@gmail.com',
    categoryId: 'medical_store',
    subcategoryId: 'pharmacy_supplies',
    services: [
      '24/7 Prescription Allopathic Medicines',
      'Affordable Jan Aushadhi Generic Drugs',
      'Rapid Doorstep Medicine Delivery',
      'Baby Diapers, Cerelac & Infant Care',
      'BP Monitors & Digital Thermometers'
    ],
    state: 'Gujarat',
    city: 'Ahmedabad',
    area: 'Vastrapur',
    address: 'Shop 4, Ground Floor, Sunrise Center, Opposite Vastrapur Lake',
    pincode: '380015',
    lat: 23.0370,
    lng: 72.5310,
    description: 'Reliable 24-hour round-the-clock licensed pharmacy next to Vastrapur Lake. Complete inventory of rare oncology, cardiac, diabetic medications, cold-chain insulin storage, and 30-minute doorstep home delivery.',
    experienceYears: 15,
    startingPrice: 50,
    rating: 4.8,
    reviewCount: 104,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '00:00',
      closeTime: '23:59',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4',
    stats: {
      views: 2600,
      calls: 580,
      whatsapp: 430,
      directions: 290,
      qrScans: 195,
      enquiries: 160,
      totalEarnings: 89000
    },
    qrToken: 'VBV-GUJ-PHARM-019',
    createdAt: '2025-01-14T00:00:00Z'
  },
  {
    id: 'sterling-hospital-vesu',
    businessName: 'Sterling Multi-Speciality Hospital & Trauma',
    ownerName: 'Dr. Rajesh Prajapati (Medical Director)',
    phone: '+91 97250 88200',
    whatsapp: '919725088200',
    email: 'info@sterlingsurat.org',
    categoryId: 'hospital',
    subcategoryId: 'emergency_surgery',
    services: [
      '24/7 Trauma, Accident & ICU Support',
      'General Laparoscopic & Ortho Surgeries',
      'Maternity, Normal & C-Section Delivery',
      'Digital X-Ray, Sonography & CT Scan',
      'Ayushman PMJAY Cashless & TPA Mediclaim'
    ],
    state: 'Gujarat',
    city: 'Surat',
    area: 'Vesu',
    address: 'Near Someshwara Square, VIP Road, Vesu',
    pincode: '395007',
    lat: 21.1490,
    lng: 72.7790,
    description: '150-bed NABH-accredited tertiary care hospital in Vesu, Surat. 24/7 cardiac ICU, modern modular operation theatres, cashless Ayushman PMJAY and all major TPA corporate insurance approvals.',
    experienceYears: 19,
    startingPrice: 500,
    rating: 4.8,
    reviewCount: 165,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '00:00',
      closeTime: '23:59',
      isOpenToday: true
    },
    serviceAtCustomerLocation: false,
    logoUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4',
    stats: {
      views: 3400,
      calls: 820,
      whatsapp: 490,
      directions: 430,
      qrScans: 310,
      enquiries: 240,
      totalEarnings: 190000
    },
    qrToken: 'VBV-GUJ-HOSP-020',
    createdAt: '2025-01-02T00:00:00Z'
  },
  {
    id: 'silveroak-college-sghighway',
    businessName: 'Silver Oak Institute of Technology & Higher Studies',
    ownerName: 'Prof. Jignesh Dave (Dean Admissions)',
    phone: '+91 99099 22340',
    whatsapp: '919909222340',
    email: 'admissions@silveroakcollege.edu.in',
    categoryId: 'college',
    subcategoryId: 'higher_degrees',
    services: [
      'B.Tech / BE Engineering & Diploma',
      'B.Com, BBA & MBA Management Degree',
      'BCA & MCA Computer Applications',
      'Campus Placement Cell & MNC Hiring',
      'Air-Conditioned Library & Hostel Facilities'
    ],
    state: 'Gujarat',
    city: 'Ahmedabad',
    area: 'SG Highway',
    address: 'Near Gota Cross Road, Opp. Bhagwat Vidyapith, SG Highway',
    pincode: '382481',
    lat: 23.0920,
    lng: 72.5340,
    description: 'Premier AICTE-approved engineering and management university campus in Ahmedabad. Over 70+ state-of-the-art research laboratories, incubation center for student startups, and 92% annual campus placement record.',
    experienceYears: 16,
    startingPrice: 35000,
    rating: 4.8,
    reviewCount: 210,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sat',
      openTime: '08:30',
      closeTime: '17:30',
      isOpenToday: true
    },
    serviceAtCustomerLocation: false,
    logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cleaning-the-floor-with-a-mop-41586-large.mp4',
    stats: {
      views: 4200,
      calls: 780,
      whatsapp: 540,
      directions: 460,
      qrScans: 350,
      enquiries: 290,
      totalEarnings: 280000
    },
    qrToken: 'VBV-GUJ-COLL-021',
    createdAt: '2025-01-04T08:00:00Z'
  },
  {
    id: 'swaminarayan-school-kudasan',
    businessName: 'Shree Swaminarayan International Public School',
    ownerName: 'Trustee Board / Principal Sharma',
    phone: '+91 98252 66014',
    whatsapp: '919825266014',
    email: 'info@swaminarayanschool.ac.in',
    categoryId: 'school',
    subcategoryId: 'k12_education',
    services: [
      'English & Gujarati Medium Instruction',
      'Interactive Smart Interactive Classrooms',
      'Robotics, AI & Modern Science Labs',
      'Cricket, Football & Athletics Coaching',
      'GPS-Tracked Safe School Bus Network'
    ],
    state: 'Gujarat',
    city: 'Gandhinagar',
    area: 'Kudasan',
    address: 'Near Bhaijipura Cross Roads, Kudasan, Gandhinagar',
    pincode: '382421',
    lat: 23.1850,
    lng: 72.6350,
    description: 'CBSE and GSEB affiliated English medium institution fostering academic brilliance and moral values. Lush green 10-acre campus, synthetic athletic tracks, Olympic-size swimming pool, and CCTV monitored smart classrooms.',
    experienceYears: 21,
    startingPrice: 22000,
    rating: 4.9,
    reviewCount: 130,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sat',
      openTime: '07:30',
      closeTime: '15:30',
      isOpenToday: true
    },
    serviceAtCustomerLocation: false,
    logoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cleaning-the-floor-with-a-mop-41586-large.mp4',
    stats: {
      views: 3100,
      calls: 620,
      whatsapp: 410,
      directions: 340,
      qrScans: 240,
      enquiries: 210,
      totalEarnings: 175000
    },
    qrToken: 'VBV-GUJ-SCH-022',
    createdAt: '2025-01-06T07:30:00Z'
  },
  {
    id: 'bachpan-kindergarten-bopal',
    businessName: 'Bachpan Play School & Kindergarten',
    ownerName: 'Mrs. Riddhi Mehra',
    phone: '+91 97120 44510',
    whatsapp: '919712044510',
    email: 'bachpan.bopal@gmail.com',
    categoryId: 'kindergarten',
    subcategoryId: 'early_learning',
    services: [
      'Phonics & Jolly Phonics Reading',
      'Montessori Play-Way Mathematics',
      'Color, Craft & Clay Modeling Studio',
      'Child-Proof Padded Classrooms',
      'Safe Doorstep Van Pick & Drop'
    ],
    state: 'Gujarat',
    city: 'Ahmedabad',
    area: 'Bopal',
    address: 'Bungalow 18, Gala Arya Villa, South Bopal Road',
    pincode: '380058',
    lat: 23.0270,
    lng: 72.4690,
    description: 'India\'s leading preschool brand in Bopal. Nurturing children aged 2 to 5 years through child-centric discovery play, interactive multimedia smart-boards, speech enhancement, and clean hygienic surroundings.',
    experienceYears: 10,
    startingPrice: 15000,
    rating: 4.9,
    reviewCount: 82,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: false,
    businessHours: {
      days: 'Mon - Fri',
      openTime: '08:30',
      closeTime: '13:00',
      isOpenToday: true
    },
    serviceAtCustomerLocation: false,
    logoUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4',
    stats: {
      views: 1750,
      calls: 340,
      whatsapp: 260,
      directions: 180,
      qrScans: 130,
      enquiries: 95,
      totalEarnings: 82000
    },
    qrToken: 'VBV-GUJ-KG-023',
    createdAt: '2025-01-18T08:30:00Z'
  },
  {
    id: 'kidzee-playgroup-gotri',
    businessName: 'Kidzee Toddler Playgroup & Daycare',
    ownerName: 'Pooja Vyas',
    phone: '+91 98259 88123',
    whatsapp: '919825988123',
    email: 'kidzeegotri@gmail.com',
    categoryId: 'playgroup',
    subcategoryId: 'infant_toddler_care',
    services: [
      'Toddler Sensory & Motor Skill Play (1.5 - 3 Yrs)',
      'Full-Day & Flexible Working Hours Daycare',
      'Live CCTV Mother Access via Mobile App',
      'Fresh Homestyle Hygienic Meals & Milk',
      'Gentle Potty Training & Clean Sleeping Beds'
    ],
    state: 'Gujarat',
    city: 'Vadodara',
    area: 'Gotri',
    address: 'Plot 42, Opp. Gotri Lake Garden, Gotri Road',
    pincode: '390021',
    lat: 22.3190,
    lng: 73.1420,
    description: 'Safe haven for toddlers and infants of working parents in Gotri, Vadodara. Fully air-conditioned, CCTV app access for mothers, loving trained nannies, sensory sandpit, and homestyle freshly cooked hot khichdi & milk.',
    experienceYears: 12,
    startingPrice: 3500,
    rating: 4.9,
    reviewCount: 68,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sat',
      openTime: '08:00',
      closeTime: '19:30',
      isOpenToday: true
    },
    serviceAtCustomerLocation: false,
    logoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4',
    stats: {
      views: 1980,
      calls: 410,
      whatsapp: 290,
      directions: 195,
      qrScans: 140,
      enquiries: 110,
      totalEarnings: 95000
    },
    qrToken: 'VBV-GUJ-PLAY-024',
    createdAt: '2025-01-20T08:00:00Z'
  },
  {
    id: 'shambhus-kadak-chai-bodakdev',
    businessName: 'Shambhu\'s Coffee Bar & Kadak Chai',
    ownerName: 'Parthiv Patel',
    phone: '+91 98251 44320',
    whatsapp: '919825144320',
    email: 'shambhu.bodakdev@gmail.com',
    categoryId: 'tea_stall',
    subcategoryId: 'chai_snacks',
    services: [
      'Masala Kadak Cutting Chai',
      'Kulhad Chai & Amul Bun Maska',
      'Cold Bournvita & Thick Shakes',
      'Adrak Elaichi Special Chai',
      'Corporate Office Tea Flask Service'
    ],
    state: 'Gujarat',
    city: 'Ahmedabad',
    area: 'Bodakdev',
    address: 'Near Judges Bungalow Road, Bodakdev, SG Highway',
    pincode: '380054',
    lat: 23.0450,
    lng: 72.5180,
    description: 'Ahmedabad\'s most popular evening hangout and youth tea hotspot. Famous for slow-cooked Kadak Masala Chai brewed with pure fresh milk, hot toasted Amul bun maska, kulhad tea, and quick flask delivery to SG Highway corporate offices.',
    experienceYears: 14,
    startingPrice: 20,
    rating: 4.9,
    reviewCount: 210,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '06:30',
      closeTime: '00:00',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4',
    stats: {
      views: 3800,
      calls: 780,
      whatsapp: 510,
      directions: 420,
      qrScans: 350,
      enquiries: 190,
      totalEarnings: 74000
    },
    qrToken: 'VBV-GUJ-TEA-025',
    createdAt: '2025-01-07T06:30:00Z'
  },
  {
    id: 'laxmi-special-tea-surat',
    businessName: 'Laxmi Goti Soda & Special Elaichi Chai Stall',
    ownerName: 'Hiteshbhai Rathod',
    phone: '+91 97129 65541',
    whatsapp: '919712965541',
    email: 'laxmiteasurat@gmail.com',
    categoryId: 'tea_stall',
    subcategoryId: 'chai_snacks',
    services: [
      'Special Elaichi Adrak Chai',
      'Fresh Amul Butter Bun Maska',
      'Surati Goti Soda & Jeera Masala',
      'Piping Hot Samosa & Poha',
      'Late Night Highway Flask Tea'
    ],
    state: 'Gujarat',
    city: 'Surat',
    area: 'Varachha',
    address: 'Opp. Mini Bazaar, Varachha Main Road',
    pincode: '395006',
    lat: 21.2180,
    lng: 72.8550,
    description: 'Surat\'s renowned 24-hour diamond hub tea destination. Handcrafted fragrant cardamom tea, hot brun maska, traditional Surati goti soda, and refreshing mint lemon coolers serving diamond merchants and textile traders.',
    experienceYears: 22,
    startingPrice: 20,
    rating: 4.8,
    reviewCount: 168,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '06:00',
      closeTime: '01:00',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-an-electrician-connecting-wires-41584-large.mp4',
    stats: {
      views: 2950,
      calls: 530,
      whatsapp: 370,
      directions: 310,
      qrScans: 260,
      enquiries: 140,
      totalEarnings: 61000
    },
    qrToken: 'VBV-GUJ-TEA-026',
    createdAt: '2025-01-10T06:00:00Z'
  },
  {
    id: 'gwalior-royal-pan-ahmedabad',
    businessName: 'Gwalior Royal Pan Parlour & Mukhwas',
    ownerName: 'Rakeshbhai Chaurasia',
    phone: '+91 98982 31109',
    whatsapp: '919898231109',
    email: 'gwaliorpan.ahm@gmail.com',
    categoryId: 'pan_parlour',
    subcategoryId: 'pan_mukhwas',
    services: [
      'Calcutta Meetha Chocolate Pan',
      'Banarasi Maghai Sada Pan',
      'Fire & Ice Smoker Pan',
      'Natural Rajwadi Mukhwas & Supari',
      'Cold Energy Drinks & Sodas',
      'Wedding Party Pan Stalls'
    ],
    state: 'Gujarat',
    city: 'Ahmedabad',
    area: 'Navrangpura',
    address: 'Shop 4, Municipal Market, C.G. Road, Navrangpura',
    pincode: '380009',
    lat: 23.0330,
    lng: 72.5580,
    description: 'Ahmedabad C.G. Road\'s landmark pan parlour. Handcrafted royal Calcutta Meetha with silver vark, fresh fragrant gulkand, chocolate and fire ice pan, alongside over 50 gourmet Gujarati roasted mukhwas varieties.',
    experienceYears: 24,
    startingPrice: 30,
    rating: 4.9,
    reviewCount: 184,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '08:30',
      closeTime: '01:00',
      isOpenToday: true
    },
    serviceAtCustomerLocation: false,
    logoUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cleaning-the-floor-with-a-mop-41586-large.mp4',
    stats: {
      views: 3400,
      calls: 480,
      whatsapp: 390,
      directions: 340,
      qrScans: 275,
      enquiries: 95,
      totalEarnings: 59000
    },
    qrToken: 'VBV-GUJ-PAN-027',
    createdAt: '2025-01-09T08:30:00Z'
  },
  {
    id: 'kesar-mukhwas-pan-surat',
    businessName: 'Kesar Pan Parlour & Royal Dryfruit Mukhwas',
    ownerName: 'Ashishbhai Vashi',
    phone: '+91 98244 90812',
    whatsapp: '919824490812',
    email: 'kesarpan.surat@gmail.com',
    categoryId: 'pan_parlour',
    subcategoryId: 'pan_mukhwas',
    services: [
      'Special Silver Vark Meetha Pan',
      'Kesar Kasturi Royal Pan',
      'Sugar-Free Digestive Mukhwas',
      'Cold Thick Badam Milk & Lassi',
      'Corporate Gift Box Mukhwas Hampers'
    ],
    state: 'Gujarat',
    city: 'Surat',
    area: 'Athwa',
    address: 'Opp. Jolly Arcade, Ghod Dod Road, Athwa',
    pincode: '395007',
    lat: 21.1730,
    lng: 72.8020,
    description: 'Surat\'s elite sweet pan and digestive mukhwas parlor on Ghod Dod Road. Authentic Banarasi Maghai, silver leaf royal Calcutta meetha, sugar-free digestive seeds, and custom wedding hampers.',
    experienceYears: 19,
    startingPrice: 35,
    rating: 4.9,
    reviewCount: 156,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '09:00',
      closeTime: '00:30',
      isOpenToday: true
    },
    serviceAtCustomerLocation: false,
    logoUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cleaning-the-floor-with-a-mop-41586-large.mp4',
    stats: {
      views: 3100,
      calls: 410,
      whatsapp: 320,
      directions: 280,
      qrScans: 220,
      enquiries: 85,
      totalEarnings: 53000
    },
    qrToken: 'VBV-GUJ-PAN-028',
    createdAt: '2025-01-11T09:00:00Z'
  },
  {
    id: 'shringar-bridal-parlour-ahmedabad',
    businessName: 'Shringar Bridal Studio & Beauty Parlour',
    ownerName: 'Kripa Ben Shah',
    phone: '+91 98791 22430',
    whatsapp: '919879122430',
    email: 'shringarbridal.ahm@gmail.com',
    categoryId: 'beauty_parlour',
    subcategoryId: 'bridal_beauty',
    services: [
      'HD & Airbrush Bridal Makeup',
      'Pre-Bridal Luxury Skin Facial',
      'Rica Brazilian Painless Waxing',
      'Moroccan Oil Hair Spa & Smoothening',
      'Traditional Gujarati Mehndi Artist',
      'Party Makeup & Saree Draping'
    ],
    state: 'Gujarat',
    city: 'Ahmedabad',
    area: 'Satellite',
    address: '201, Dev Arc Mall, Iscon Cross Roads, SG Highway - Satellite',
    pincode: '380015',
    lat: 23.0290,
    lng: 72.5080,
    description: 'Ahmedabad\'s celebrated bridal makeover and aesthetic skin lounge. Specialists in HD bridal makeup with MAC and Kryolan, pre-bridal radiance packages, organic gold facials, hair spa therapy, and painless waxing.',
    experienceYears: 16,
    startingPrice: 299,
    rating: 4.9,
    reviewCount: 132,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sun',
      openTime: '10:00',
      closeTime: '20:30',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cleaning-the-floor-with-a-mop-41586-large.mp4',
    stats: {
      views: 3100,
      calls: 620,
      whatsapp: 490,
      directions: 240,
      qrScans: 190,
      enquiries: 125,
      totalEarnings: 82000
    },
    qrToken: 'VBV-GUJ-BEAUTY-029',
    createdAt: '2025-01-14T10:00:00Z'
  },
  {
    id: 'nayanas-herbal-beauty-vadodara',
    businessName: 'Nayana\'s Herbal Beauty Care & Bridal Lounge',
    ownerName: 'Nayanaben Parmar',
    phone: '+91 94270 33819',
    whatsapp: '919427033819',
    email: 'nayanasbeauty.vadodara@gmail.com',
    categoryId: 'beauty_parlour',
    subcategoryId: 'bridal_beauty',
    services: [
      'Organic Fruit & Herb Facial',
      'Bridal Hair Styling & Saree Draping',
      'Gel Nail Extensions & Art',
      'Herbal Hair Fall & Dandruff Treatment',
      'Eyebrow Threading & Bleach'
    ],
    state: 'Gujarat',
    city: 'Vadodara',
    area: 'Alkapuri',
    address: '12, Windsor Plaza, RC Dutt Road, Alkapuri',
    pincode: '390007',
    lat: 22.3120,
    lng: 73.1710,
    description: 'Alkapuri\'s leading women\'s salon and pre-wedding beauty salon. Pure herbal skincare treatments, gentle waxing, authentic Gujarati bridal makeup, nail art, and hair rejuvenation therapies.',
    experienceYears: 15,
    startingPrice: 199,
    rating: 4.8,
    reviewCount: 89,
    verificationStatus: 'verified',
    isPhoneVerified: true,
    isLocationVerified: true,
    isDocsVerified: true,
    isFeatured: true,
    businessHours: {
      days: 'Mon - Sat',
      openTime: '10:00',
      closeTime: '20:00',
      isOpenToday: true
    },
    serviceAtCustomerLocation: true,
    logoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1200&auto=format&fit=crop&q=80',
    photos: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80'
    ],
    currentSnaps: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80'
    ],
    liveVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cleaning-the-floor-with-a-mop-41586-large.mp4',
    stats: {
      views: 2200,
      calls: 430,
      whatsapp: 310,
      directions: 170,
      qrScans: 120,
      enquiries: 74,
      totalEarnings: 47000
    },
    qrToken: 'VBV-GUJ-BEAUTY-030',
    createdAt: '2025-01-18T10:00:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    vendorId: 'patel-electrical-satellite',
    customerName: 'Kiritbhai Shah',
    rating: 5,
    comment: 'Bhavikbhai reached our apartment in Satellite within 25 minutes on Sunday morning! Fixed the main MCB trip and installed a new Anchor switchboard with genuine bill. Highly recommended!',
    date: '2025-02-14',
    userCity: 'Ahmedabad (Satellite)',
    verifiedBooking: true,
    status: 'approved'
  },
  {
    id: 'rev-02',
    vendorId: 'patel-electrical-satellite',
    customerName: 'Anil Desai',
    rating: 5,
    comment: 'Very polite and knowledgeable electrician. Checked entire flat wiring with tester and found a hidden earth leakage. Clean and tidy work.',
    date: '2025-02-18',
    userCity: 'Ahmedabad (Vastrapur)',
    verifiedBooking: true,
    status: 'approved'
  },
  {
    id: 'rev-03',
    vendorId: 'surat-cool-point-adajan',
    customerName: 'Manish Choksi',
    rating: 5,
    comment: 'Jet pump foam wash did wonders for our Daikin split AC in Adajan. Cooling is like brand new. Alpesh explained everything transparently.',
    date: '2025-02-10',
    userCity: 'Surat (Adajan)',
    verifiedBooking: true,
    status: 'approved'
  },
  {
    id: 'rev-04',
    vendorId: 'shreeji-plumbing-alkapuri',
    customerName: 'Sneha Trivedi',
    rating: 5,
    comment: 'Solved our severe kitchen drain blockage in Alkapuri within an hour using their electric spring machine. No tiles damaged. Very satisfied.',
    date: '2025-02-22',
    userCity: 'Vadodara (Alkapuri)',
    verifiedBooking: true,
    status: 'approved'
  },
  {
    id: 'rev-05',
    vendorId: 'royal-tea-ahmedabad',
    customerName: 'Pragnesh Vora',
    rating: 5,
    comment: 'Best ginger-masala chai tapri on S.G. Highway! The maska bun is freshly baked and tea is boiled to perfection in brass kitli.',
    date: '2025-02-25',
    userCity: 'Ahmedabad (Bodakdev)',
    verifiedBooking: true,
    status: 'pending'
  },
  {
    id: 'rev-06',
    vendorId: 'patel-electrical-satellite',
    customerName: 'Unknown Bot / Crypto Promo',
    rating: 1,
    comment: 'URGENT: Earn 50000 daily fast guaranteed loans at 0% interest contact WhatsApp 99999-XXXXX or visit telegram scam link! Do not hire this electrician.',
    date: '2025-02-26',
    userCity: 'Unknown IP',
    verifiedBooking: false,
    status: 'flagged',
    flagReason: 'Automated spam & malicious third-party promotional links detected'
  },
  {
    id: 'rev-07',
    vendorId: 'shringar-beauty-satellite',
    customerName: 'Dharaben Patel',
    rating: 5,
    comment: 'Booked bridal makeover package for my sister. Meenaben and her team arrived right on schedule at our venue in Satellite with HD makeup kits.',
    date: '2025-02-27',
    userCity: 'Ahmedabad (Satellite)',
    verifiedBooking: false,
    status: 'pending'
  }
];

export const INITIAL_LEADS: EnquiryLead[] = [
  {
    id: 'lead-01',
    vendorId: 'patel-electrical-satellite',
    customerName: 'Nirav Parikh',
    customerPhone: '+91 98795 23411',
    customerArea: 'Satellite',
    service: 'Wiring & Rewiring',
    message: 'Need complete rewiring inspection for 3BHK flat before painting work starts next week.',
    preferredDate: '2025-03-02',
    preferredTime: '10:00 AM - 12:00 PM',
    status: 'new',
    createdAt: '2025-02-28T09:15:00Z',
    advancePaid: 199,
    paymentRef: 'UPI-VBV-98721'
  },
  {
    id: 'lead-02',
    vendorId: 'patel-electrical-satellite',
    customerName: 'Rupal Mehta',
    customerPhone: '+91 98240 88712',
    customerArea: 'Vastrapur',
    service: 'Solar Inverter Maintenance',
    message: 'Inverter backup dropped to 30 minutes. Please check tubular battery water and charging panel.',
    preferredDate: '2025-03-03',
    preferredTime: '02:00 PM - 04:00 PM',
    status: 'contacted',
    createdAt: '2025-02-27T14:30:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    type: 'order',
    title: 'New Service Booking Confirmed',
    message: 'Nirav Parikh booked Wiring & Rewiring inspection in Satellite. Advance of ₹199 received.',
    timestamp: '10 mins ago',
    read: false,
    amount: 199
  },
  {
    id: 'notif-02',
    type: 'review',
    title: '5-Star Review Received',
    message: 'Anil Desai posted a 5-star review for Patel Electrical Services.',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'notif-03',
    type: 'promo',
    title: 'Gujarat Business Spotlight',
    message: 'Get your listing verified this week to unlock free featured placement across Ahmedabad.',
    timestamp: '1 day ago',
    read: true
  }
];
