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

export const INITIAL_VENDORS: Vendor[] = [];

export const INITIAL_REVIEWS: Review[] = [];

export const INITIAL_LEADS: EnquiryLead[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
