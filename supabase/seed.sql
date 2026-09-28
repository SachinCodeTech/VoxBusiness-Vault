-- ============================================================================
-- VOX BUSINESS VAULT: PRODUCTION SEED DATASET
-- State -> City -> Area -> Pincode + Categories + Vendors
-- ============================================================================

-- 1. STATES
INSERT INTO public.states (id, name, code, is_active) VALUES
('gujarat', 'Gujarat', 'GJ', true),
('maharashtra', 'Maharashtra', 'MH', false),
('rajasthan', 'Rajasthan', 'RJ', false)
ON CONFLICT (id) DO NOTHING;

-- 2. CITIES
INSERT INTO public.cities (id, state_id, name, gujarati_name, hindi_name, lat, lng, is_popular) VALUES
('ahmedabad', 'gujarat', 'Ahmedabad', 'અમદાવાદ', 'अहमदाबाद', 23.0225, 72.5714, true),
('surat', 'gujarat', 'Surat', 'સુરત', 'सूरत', 21.1702, 72.8311, true),
('vadodara', 'gujarat', 'Vadodara', 'વડોદરા', 'वडोदरा', 22.3072, 73.1812, true),
('rajkot', 'gujarat', 'Rajkot', 'રાજકોટ', 'राजकोट', 22.3039, 70.8022, true),
('bhavnagar', 'gujarat', 'Bhavnagar', 'ભાવનગર', 'भावनगर', 21.7645, 72.1519, false),
('jamnagar', 'gujarat', 'Jamnagar', 'જામનગર', 'जामनगर', 22.4707, 70.0577, false),
('junagadh', 'gujarat', 'Junagadh', 'જુનાગઢ', 'जूनागढ़', 21.5222, 70.4579, false),
('gandhinagar', 'gujarat', 'Gandhinagar', 'ગાંધીનગર', 'गांधीनगर', 23.2156, 72.6369, true)
ON CONFLICT (id) DO NOTHING;

-- 3. AREAS & PINCODES
INSERT INTO public.areas (id, city_id, name, gujarati_name, pincode, lat, lng) VALUES
('ahm_satellite', 'ahmedabad', 'Satellite', 'સેટેલાઇટ', '380015', 23.0290, 72.5080),
('ahm_bodakdev', 'ahmedabad', 'Bodakdev', 'બોડકદેવ', '380054', 23.0450, 72.5180),
('ahm_navrangpura', 'ahmedabad', 'Navrangpura', 'નવરંગપુરા', '380009', 23.0360, 72.5480),
('ahm_vastrapur', 'ahmedabad', 'Vastrapur', 'વસ્ત્રાપુર', '380015', 23.0350, 72.5250),
('ahm_prahladnagar', 'ahmedabad', 'Prahlad Nagar', 'પ્રહલાદ નગર', '380051', 23.0120, 72.5070),
('sur_adajan', 'surat', 'Adajan', 'અડાજણ', '395009', 21.1980, 72.7890),
('sur_varachha', 'surat', 'Varachha', 'વરાછા', '395006', 21.2180, 72.8550),
('sur_ghoddod', 'surat', 'Ghod Dod Road', 'ઘોડ દોડ રોડ', '395007', 21.1730, 72.8020),
('vad_alkapuri', 'vadodara', 'Alkapuri', 'અલકાપુરી', '390007', 22.3120, 73.1710),
('vad_fatehgunj', 'vadodara', 'Fatehgunj', 'ફતેહગંજ', '390002', 22.3240, 73.1890),
('raj_kalawad', 'rajkot', 'Kalawad Road', 'કાલાવડ રોડ', '360005', 22.2890, 70.7760),
('raj_yagnik', 'rajkot', 'Yagnik Road', 'યાજ્ઞિક રોડ', '360001', 22.2980, 70.7950)
ON CONFLICT (id) DO NOTHING;

-- 4. CATEGORIES
INSERT INTO public.categories (id, name, gujarati_name, hindi_name, icon_name, popular, sort_order) VALUES
('tea_stall', 'Tea Stall & Chai Tapri', 'ચા ની કીટલી અને ટી સ્ટોલ', 'चाय टपरी व टी स्टॉल', 'Coffee', true, 1),
('pan_parlour', 'Pan Parlour & Mukhwas', 'પાન પાર્લર અને મુખવાસ', 'पान पार्लर व मुखवास', 'Leaf', true, 2),
('beauty_parlour', 'Beauty Parlour & Bridal Studio', 'બ્યુટી પાર્લર અને બ્રાઇડલ સ્ટુડિયો', 'ब्यूटी पार्लर व ब्राइडल स्टूडियो', 'Sparkles', true, 3),
('hair_salon', 'Hair Saloon & Grooming', 'હેર સલૂન અને કટીંગ', 'हेयर सैलून व ग्रूमिंग', 'Scissors', true, 4),
('clinic', 'Doctor Clinic & Dispensary', 'ડોક્ટર ક્લિનિક અને દવાખાનું', 'डॉक्टर क्लिनिक व डिस्पेंसरी', 'Stethoscope', true, 5),
('medical_store', 'Medical Store & Pharmacy', 'મેડિકલ સ્ટોર અને દવાની દુકાન', 'मेडिकल स्टोर व फार्मेसी', 'Pill', true, 6),
('electrician', 'Electrician & Wiring', 'ઇલેક્ટ્રિશિયન અને વાયરિંગ', 'इलेक्ट्रीशियन व वायरिंग', 'Zap', true, 7),
('plumber', 'Plumber & Sanitary', 'પ્લમ્બર અને સેનિટરી', 'प्लम्बर व सेनेटरी', 'Wrench', true, 8),
('ac_services', 'AC Repair & Cooling', 'એસી રીપેરિંગ અને સર્વિસ', 'एसी रिपेयर व सर्विस', 'AirVent', true, 9),
('solar_energy', 'Solar Rooftop & Surya Gujarat', 'સોલાર રૂફટોપ અને સૂર્ય ઊર્જા', 'सोलर रूफटॉप व सूर्य ऊर्जा', 'Sun', true, 10),
('catering_farsan', 'Caterers, Mandap & Farsan', 'કેટરર્સ, મંડપ અને ફરસાણ', 'कैटरर्स, मंडप व फरसाण', 'UtensilsCrossed', true, 11)
ON CONFLICT (id) DO NOTHING;

-- 5. SUBCATEGORIES
INSERT INTO public.subcategories (id, category_id, name, gujarati_name) VALUES
('tea_snacks', 'tea_stall', 'Traditional Kadak Chai & Snacks', 'કડક ચા અને નાસ્તો'),
('pan_mukhwas', 'pan_parlour', 'Royal Pan, Mukhwas & Beverages', 'શાહી પાન અને મુખવાસ'),
('bridal_beauty', 'beauty_parlour', 'Bridal Makeup, Skin & Hair', 'બ્રાઇડલ મેકઅપ અને સ્કિન'),
('men_grooming', 'hair_salon', 'Men Styling & Grooming', 'હેર કટીંગ અને શેવિંગ'),
('general_physician', 'clinic', 'General Physician & OPD', 'ફેમિલી ડોક્ટર'),
('pharmacy_247', 'medical_store', '24/7 Prescription Pharmacy', 'દવાઓ'),
('elec_home', 'electrician', 'Home Electrical & MCB', 'ઘર વાયરિંગ'),
('ac_jet_wash', 'ac_services', 'AC Jet Service & Gas Refill', 'એસી સર્વિસ'),
('solar_rooftop', 'solar_energy', 'Surya Gujarat Rooftop 3kW-10kW', 'સોલાર રૂફટોપ')
ON CONFLICT (id) DO NOTHING;

-- 6. SERVICES
INSERT INTO public.services (id, subcategory_id, name, gujarati_name) VALUES
('masala_kadak_chai', 'tea_snacks', 'Masala Kadak Cutting Chai', 'મસાલા કડક કટિંગ ચા'),
('bun_maska', 'tea_snacks', 'Fresh Amul Butter Bun Maska', 'અમૂલ બટર બન મસ્કા'),
('calcutta_meetha_pan', 'pan_mukhwas', 'Calcutta Silver Leaf Meetha Pan', 'કલકત્તા મીઠા પાન'),
('fire_ice_pan', 'pan_mukhwas', 'Fire & Ice Smoker Pan', 'ફાયર આઈસ પાન'),
('hd_bridal_makeup', 'bridal_beauty', 'HD & Airbrush Bridal Makeup', 'એચડી બ્રાઇડલ મેકઅપ'),
('o3_radiance_facial', 'bridal_beauty', 'O3+ Gold Radiance Facial', 'ગોલ્ડ ફેશિયલ'),
('hair_keratin_spa', 'bridal_beauty', 'Moroccan Oil Hair Spa & Keratin', 'હેર સ્પા')
ON CONFLICT (id) DO NOTHING;

-- 7. SEED VENDORS (With Permanent QR Tokens)
INSERT INTO public.vendors (
    id, business_name, owner_name, phone, whatsapp, email,
    category_id, subcategory_id, state_id, city_id, area_id,
    address, pincode, lat, lng, description, experience_years,
    starting_price, verification_status, is_phone_verified, is_location_verified,
    is_docs_verified, is_featured, rating, review_count, qr_token
) VALUES
(
    'c1f7a240-45c1-4b10-8f92-562a1b901a01',
    'Shambhu''s Coffee Bar & Kadak Chai',
    'Parthiv Patel',
    '+91 98251 44320',
    '919825144320',
    'shambhu.bodakdev@gmail.com',
    'tea_stall',
    'tea_snacks',
    'gujarat',
    'ahmedabad',
    'ahm_bodakdev',
    'Near Judges Bungalow Road, Bodakdev, SG Highway',
    '380054',
    23.0450,
    72.5180,
    'Ahmedabad''s most popular evening hangout and youth tea hotspot. Famous for slow-cooked Kadak Masala Chai brewed with pure fresh milk, hot toasted Amul bun maska, kulhad tea, and quick flask delivery.',
    14,
    20.00,
    'verified',
    true,
    true,
    true,
    true,
    4.90,
    210,
    'VBV-GUJ-TEA-025'
),
(
    'd2a8b350-56d2-5c21-9a03-673b2c012b02',
    'Gwalior Royal Pan Parlour & Mukhwas',
    'Rakeshbhai Chaurasia',
    '+91 98982 31109',
    '919898231109',
    'gwaliorpan.ahm@gmail.com',
    'pan_parlour',
    'pan_mukhwas',
    'gujarat',
    'ahmedabad',
    'ahm_navrangpura',
    'Shop 4, Municipal Market, C.G. Road, Navrangpura',
    '380009',
    23.0330,
    72.5580,
    'Ahmedabad C.G. Road''s landmark pan parlour. Handcrafted royal Calcutta Meetha with silver vark, fresh fragrant gulkand, chocolate and fire ice pan, alongside over 50 gourmet Gujarati roasted mukhwas varieties.',
    24,
    30.00,
    'verified',
    true,
    true,
    true,
    true,
    4.90,
    184,
    'VBV-GUJ-PAN-027'
),
(
    'e3b9c460-67e3-6d32-ab14-784c3d123c03',
    'Shringar Bridal Studio & Beauty Parlour',
    'Kripa Ben Shah',
    '+91 98791 22430',
    '919879122430',
    'shringarbridal.ahm@gmail.com',
    'beauty_parlour',
    'bridal_beauty',
    'gujarat',
    'ahmedabad',
    'ahm_satellite',
    '201, Dev Arc Mall, Iscon Cross Roads, SG Highway - Satellite',
    '380015',
    23.0290,
    72.5080,
    'Ahmedabad''s celebrated bridal makeover and aesthetic skin lounge. Specialists in HD bridal makeup with MAC and Kryolan, pre-bridal radiance packages, organic gold facials, hair spa therapy, and painless waxing.',
    16,
    299.00,
    'verified',
    true,
    true,
    true,
    true,
    4.90,
    132,
    'VBV-GUJ-BEAUTY-029'
)
ON CONFLICT (id) DO NOTHING;
