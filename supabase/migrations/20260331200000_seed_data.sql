-- ============================================================
-- SEED DATA — Never Again AI Hackathon 2026
-- 40 submissions | 10 messages | 10 judges | 10 coordinators | 4 admins
-- Default staff password: Staff@2026!
-- Super admin (admin@gmail.com) is NOT touched here — cannot be deleted
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 1. SUBMISSIONS (40 total — 10 per category)
-- ============================================================

INSERT INTO public.submissions
  (full_name, school, email, project_title, category, description, github_link, status, created_at)
VALUES

-- ── AI & ML ──────────────────────────────────────────────────
(
  'Alice Uwimana | Bob Habimana | Claire Ineza',
  'University of Rwanda (University)',
  'alice.uwimana@ur.ac.rw',
  'AgriPredict AI',
  'AI & ML',
  E'SECTOR: University\n\nTEAM MEMBERS: Alice Uwimana (alice.uwimana@ur.ac.rw), Bob Habimana, Claire Ineza\n\nPROJECT DESCRIPTION: A machine learning model that predicts crop yields and pest outbreaks for Rwandan smallholder farmers using satellite imagery, soil sensors, and historical weather patterns. Trained on 5 years of agricultural data from MINAGRI. Achieves 89% prediction accuracy.',
  'https://github.com/alice-uwimana/agripredict',
  'approved',
  NOW() - INTERVAL '10 days'
),
(
  'David Nkurunziza | Eve Mukamana',
  'Rwanda Polytechnic (University)',
  'david.nkurunziza@rp.ac.rw',
  'KinyaBot — Kinyarwanda NLP Assistant',
  'AI & ML',
  E'SECTOR: University\n\nTEAM MEMBERS: David Nkurunziza (david.nkurunziza@rp.ac.rw), Eve Mukamana\n\nPROJECT DESCRIPTION: A conversational AI assistant trained on Kinyarwanda text data scraped from government portals, news sites, and books. Enables citizens to ask questions about public services in their native language. Uses a fine-tuned transformer model.',
  'https://github.com/david-nkurunziza/kinyabot',
  'winner',
  NOW() - INTERVAL '9 days'
),
(
  'Frank Bizimana | Grace Uwase | Henry Ndayishimiye',
  'IPRC Kigali (University)',
  'frank.bizimana@iprc.ac.rw',
  'HealthScan RW',
  'AI & ML',
  E'SECTOR: University\n\nTEAM MEMBERS: Frank Bizimana (frank.bizimana@iprc.ac.rw), Grace Uwase, Henry Ndayishimiye\n\nPROJECT DESCRIPTION: Deep learning system for early detection of malaria and pneumonia from medical images captured by low-cost mobile phones. Designed for community health workers in rural Rwanda. Achieves 94% sensitivity on test data.',
  'https://github.com/frank-bizimana/healthscan-rw',
  'approved',
  NOW() - INTERVAL '8 days'
),
(
  'Ingrid Kayitesi | James Ntwari',
  'Kigali Independent University (University)',
  'ingrid.kayitesi@kiu.ac.rw',
  'RwandaTraffic AI',
  'AI & ML',
  E'SECTOR: University\n\nTEAM MEMBERS: Ingrid Kayitesi (ingrid.kayitesi@kiu.ac.rw), James Ntwari\n\nPROJECT DESCRIPTION: Real-time traffic congestion prediction and routing system for Kigali using computer vision on CCTV feeds and historical GPS data. Reduces average commute time by an estimated 23% in simulations.',
  'https://github.com/ingrid-kayitesi/rwandatraffic',
  'pending',
  NOW() - INTERVAL '7 days'
),
(
  'Kevin Mugisha | Linda Uwineza | Moses Hakizimana',
  'GS Remera (Secondary School)',
  'kevin.mugisha@gsremera.rw',
  'EduPath AI',
  'AI & ML',
  E'SECTOR: Secondary School\n\nTEAM MEMBERS: Kevin Mugisha (kevin.mugisha@gsremera.rw), Linda Uwineza, Moses Hakizimana\n\nPROJECT DESCRIPTION: AI-powered adaptive learning platform that personalizes study paths for Rwandan secondary students based on their learning pace, subject strengths, and national exam patterns. Includes Kinyarwanda language support.',
  'https://github.com/kevin-mugisha/edupath-ai',
  'pending',
  NOW() - INTERVAL '7 days'
),
(
  'Nancy Ineza | Oscar Nshimiyimana',
  'INES Ruhengeri (University)',
  'nancy.ineza@ines.ac.rw',
  'SoilSense ML',
  'AI & ML',
  E'SECTOR: University\n\nTEAM MEMBERS: Nancy Ineza (nancy.ineza@ines.ac.rw), Oscar Nshimiyimana\n\nPROJECT DESCRIPTION: Machine learning system that analyses soil quality from smartphone photos and IoT sensor readings. Recommends fertiliser type and planting schedules. Tested on 200+ farms in the Eastern Province.',
  'https://github.com/nancy-ineza/soilsense',
  'pending',
  NOW() - INTERVAL '6 days'
),
(
  'Paul Irakoze | Queen Mukamurenzi | Rose Akimana',
  'University of Kigali (University)',
  'paul.irakoze@uk.ac.rw',
  'FloodGuard Prediction System',
  'AI & ML',
  E'SECTOR: University\n\nTEAM MEMBERS: Paul Irakoze (paul.irakoze@uk.ac.rw), Queen Mukamurenzi, Rose Akimana\n\nPROJECT DESCRIPTION: LSTM-based flood prediction model using real-time rainfall data, river gauge levels, and terrain maps. Sends early-warning SMS alerts to communities in flood-prone districts up to 48 hours in advance.',
  'https://github.com/paul-irakoze/floodguard',
  'shortlisted',
  NOW() - INTERVAL '6 days'
),
(
  'Samuel Niyonsaba | Tina Uwimpuhwe',
  'GS Kicukiro (Secondary School)',
  'samuel.niyonsaba@gskicukiro.rw',
  'MarketMind — Price Predictor',
  'AI & ML',
  E'SECTOR: Secondary School\n\nTEAM MEMBERS: Samuel Niyonsaba (samuel.niyonsaba@gskicukiro.rw), Tina Uwimpuhwe\n\nPROJECT DESCRIPTION: Predicts market prices for 15 key agricultural commodities in Rwandan markets using time-series forecasting. Helps farmers and traders make informed buy/sell decisions. Web and USSD interface included.',
  NULL,
  'pending',
  NOW() - INTERVAL '5 days'
),
(
  'Ursula Mukagasana | Victor Habiyambere | Winnie Ndagijimana',
  'Carnegie Mellon University Africa (University)',
  'ursula.mukagasana@cmu.ac.rw',
  'TalentMatch AI',
  'AI & ML',
  E'SECTOR: University\n\nTEAM MEMBERS: Ursula Mukagasana (ursula.mukagasana@cmu.ac.rw), Victor Habiyambere, Winnie Ndagijimana\n\nPROJECT DESCRIPTION: AI-powered job matching platform that connects Rwandan youth with employment opportunities based on skills, location, and career trajectory. Uses NLP to parse CVs and job descriptions. Integrated with WDA database.',
  'https://github.com/ursula-mukagasana/talentmatch',
  'reviewed',
  NOW() - INTERVAL '5 days'
),
(
  'Xavier Nzeyimana | Yasmine Umubyeyi',
  'ALU Rwanda (University)',
  'xavier.nzeyimana@alurwanda.org',
  'CancerDetect Mobile',
  'AI & ML',
  E'SECTOR: University\n\nTEAM MEMBERS: Xavier Nzeyimana (xavier.nzeyimana@alurwanda.org), Yasmine Umubyeyi\n\nPROJECT DESCRIPTION: Mobile application for early cervical cancer screening using AI image analysis on colposcopy images. Designed to extend screening coverage in areas without specialist doctors. Validated with 300 patient samples from CHUK.',
  'https://github.com/xavier-nzeyimana/cancerdetect',
  'pending',
  NOW() - INTERVAL '4 days'
),

-- ── Web & Mobile ─────────────────────────────────────────────
(
  'Amina Batamuliza | Brian Gakuba | Celine Murenzi',
  'University of Rwanda (University)',
  'amina.batamuliza@ur.ac.rw',
  'FarmLink Marketplace',
  'Web & Mobile',
  E'SECTOR: University\n\nTEAM MEMBERS: Amina Batamuliza (amina.batamuliza@ur.ac.rw), Brian Gakuba, Celine Murenzi\n\nPROJECT DESCRIPTION: Mobile-first marketplace connecting Rwandan farmers directly to buyers, eliminating middlemen. Features real-time price listings, order management, mobile money integration (MTN MoMo & Airtel), and logistics coordination.',
  'https://github.com/amina-batamuliza/farmlink',
  'winner',
  NOW() - INTERVAL '10 days'
),
(
  'Denis Nzamwita | Elise Ingabire',
  'IPRC Kigali (University)',
  'denis.nzamwita@iprc.ac.rw',
  'MediBook — Healthcare Appointments',
  'Web & Mobile',
  E'SECTOR: University\n\nTEAM MEMBERS: Denis Nzamwita (denis.nzamwita@iprc.ac.rw), Elise Ingabire\n\nPROJECT DESCRIPTION: Progressive web app for booking medical appointments at public and private health facilities across Rwanda. Supports SMS reminders, insurance card scanning, and telemedicine consultations. Integrated with HMIS.',
  'https://github.com/denis-nzamwita/medibook',
  'approved',
  NOW() - INTERVAL '9 days'
),
(
  'Fabrice Rutagengwa | Gloire Habineza | Helene Tuyishime',
  'GS Nyamirambo (Secondary School)',
  'fabrice.rutagengwa@gsnyamirambo.rw',
  'SafeRoute — Personal Safety App',
  'Web & Mobile',
  E'SECTOR: Secondary School\n\nTEAM MEMBERS: Fabrice Rutagengwa (fabrice.rutagengwa@gsnyamirambo.rw), Gloire Habineza, Helene Tuyishime\n\nPROJECT DESCRIPTION: Personal safety mobile app that tracks user location, enables one-tap SOS alerts to trusted contacts and local police, and identifies safe walking routes in Kigali. Offline-capable for low-connectivity areas.',
  'https://github.com/fabrice-rutagengwa/saferoute',
  'pending',
  NOW() - INTERVAL '8 days'
),
(
  'Ivan Ishimwe | Julie Nyiransabimana',
  'Rwanda Polytechnic (University)',
  'ivan.ishimwe@rp.ac.rw',
  'SkillBridge Training Platform',
  'Web & Mobile',
  E'SECTOR: University\n\nTEAM MEMBERS: Ivan Ishimwe (ivan.ishimwe@rp.ac.rw), Julie Nyiransabimana\n\nPROJECT DESCRIPTION: Online vocational training platform offering short courses in digital skills, tailored for Rwandan youth who missed formal education. Features offline video downloads, progress certificates, and employer connections.',
  'https://github.com/ivan-ishimwe/skillbridge',
  'shortlisted',
  NOW() - INTERVAL '7 days'
),
(
  'Kalinda Mukamana | Leon Nsengimana | Maria Uwamariya',
  'INES Ruhengeri (University)',
  'kalinda.mukamana@ines.ac.rw',
  'TravelRwanda — Tourism App',
  'Web & Mobile',
  E'SECTOR: University\n\nTEAM MEMBERS: Kalinda Mukamana (kalinda.mukamana@ines.ac.rw), Leon Nsengimana, Maria Uwamariya\n\nPROJECT DESCRIPTION: Comprehensive tourism mobile app showcasing Rwanda\'s national parks, cultural sites, and experiences. Features AR-powered trail guides, booking integration, offline maps, and AI-powered trip planning in English, French, and Kinyarwanda.',
  'https://github.com/kalinda-mukamana/travelrwanda',
  'approved',
  NOW() - INTERVAL '7 days'
),
(
  'Nathan Ntakirutimana | Olivia Kayigamba',
  'Kigali Independent University (University)',
  'nathan.ntakirutimana@kiu.ac.rw',
  'CommunityHub — Local Governance',
  'Web & Mobile',
  E'SECTOR: University\n\nTEAM MEMBERS: Nathan Ntakirutimana (nathan.ntakirutimana@kiu.ac.rw), Olivia Kayigamba\n\nPROJECT DESCRIPTION: Digital platform for Umudugudu (village) governance that enables citizens to report issues, track service delivery, participate in community meetings, and receive announcements from local leaders. Supports USSD for feature phones.',
  NULL,
  'pending',
  NOW() - INTERVAL '6 days'
),
(
  'Patrick Nkurunziza | Rachel Uwera | Steve Bizimana',
  'GS Kacyiru (Secondary School)',
  'patrick.nkurunziza@gskacyiru.rw',
  'EduConnect — School Platform',
  'Web & Mobile',
  E'SECTOR: Secondary School\n\nTEAM MEMBERS: Patrick Nkurunziza (patrick.nkurunziza@gskacyiru.rw), Rachel Uwera, Steve Bizimana\n\nPROJECT DESCRIPTION: School management platform connecting teachers, students, and parents. Features homework submission, parent-teacher messaging, attendance tracking, and National Exam preparation resources aligned with REB curriculum.',
  'https://github.com/patrick-nkurunziza/educonnect',
  'reviewed',
  NOW() - INTERVAL '5 days'
),
(
  'Therese Ngendahimana | Ulrich Mudacumura',
  'Carnegie Mellon University Africa (University)',
  'therese.ngendahimana@cmu.ac.rw',
  'RwandaPay Digital Wallet',
  'Web & Mobile',
  E'SECTOR: University\n\nTEAM MEMBERS: Therese Ngendahimana (therese.ngendahimana@cmu.ac.rw), Ulrich Mudacumura\n\nPROJECT DESCRIPTION: Unified digital payment wallet supporting MTN MoMo, Airtel Money, bank transfers, and crypto payments for SMEs. Features invoice generation, expense tracking, tax reporting, and integration with RRA e-invoicing system.',
  'https://github.com/therese-ngendahimana/rwandapay',
  'pending',
  NOW() - INTERVAL '5 days'
),
(
  'Valerie Mukabutera | William Nkusi | Xenia Gasana',
  'ALU Rwanda (University)',
  'valerie.mukabutera@alurwanda.org',
  'GreenRwanda — Eco Tracker',
  'Web & Mobile',
  E'SECTOR: University\n\nTEAM MEMBERS: Valerie Mukabutera (valerie.mukabutera@alurwanda.org), William Nkusi, Xenia Gasana\n\nPROJECT DESCRIPTION: Environmental monitoring app that lets citizens report pollution, illegal deforestation, and waste dumping with geo-tagged photos. Dashboard for REMA to track environmental compliance. Gamification rewards eco-friendly behaviours.',
  'https://github.com/valerie-mukabutera/greenrwanda',
  'rejected',
  NOW() - INTERVAL '4 days'
),
(
  'Yves Nshuti | Zoe Uwimana',
  'University of Kigali (University)',
  'yves.nshuti@uk.ac.rw',
  'WorkSpace — Freelancer Hub',
  'Web & Mobile',
  E'SECTOR: University\n\nTEAM MEMBERS: Yves Nshuti (yves.nshuti@uk.ac.rw), Zoe Uwimana\n\nPROJECT DESCRIPTION: Freelancing platform built for the East African market. Features escrow payment protection, skills verification badges, client review system, and contract templates compliant with Rwandan labour law.',
  'https://github.com/yves-nshuti/workspace-rw',
  'pending',
  NOW() - INTERVAL '3 days'
),

-- ── Data Visualization ────────────────────────────────────────
(
  'Aaron Mugenzi | Beatrice Nikuze | Charles Rugamba',
  'University of Rwanda (University)',
  'aaron.mugenzi@ur.ac.rw',
  'RwandaStats National Dashboard',
  'Data Visualization',
  E'SECTOR: University\n\nTEAM MEMBERS: Aaron Mugenzi (aaron.mugenzi@ur.ac.rw), Beatrice Nikuze, Charles Rugamba\n\nPROJECT DESCRIPTION: Interactive public dashboard visualising key national statistics — GDP, poverty rates, literacy, health indicators — sourced from NISR open data. Features time-series animations, district-level breakdowns, and embeddable widgets for media and NGOs.',
  'https://github.com/aaron-mugenzi/rwandastats',
  'winner',
  NOW() - INTERVAL '10 days'
),
(
  'Diana Kayisire | Eric Nzabahimana',
  'Rwanda Polytechnic (University)',
  'diana.kayisire@rp.ac.rw',
  'HealthMap RW — Disease Tracker',
  'Data Visualization',
  E'SECTOR: University\n\nTEAM MEMBERS: Diana Kayisire (diana.kayisire@rp.ac.rw), Eric Nzabahimana\n\nPROJECT DESCRIPTION: Real-time disease surveillance dashboard for Rwanda\'s health ministry. Visualises outbreak data, vaccination coverage, and health facility utilisation using choropleth maps, trend lines, and alert thresholds. Data sourced from RBC DHIS2.',
  'https://github.com/diana-kayisire/healthmap-rw',
  'approved',
  NOW() - INTERVAL '9 days'
),
(
  'Fidele Nsabimana | Germaine Umutoniwase | Hubert Tuyizere',
  'GS Gisozi (Secondary School)',
  'fidele.nsabimana@gsgisozi.rw',
  'EduDash — School Metrics',
  'Data Visualization',
  E'SECTOR: Secondary School\n\nTEAM MEMBERS: Fidele Nsabimana (fidele.nsabimana@gsgisozi.rw), Germaine Umutoniwase, Hubert Tuyizere\n\nPROJECT DESCRIPTION: Interactive analytics dashboard for school administrators tracking student performance across subjects, attendance trends, and national exam pass rates. Supports comparison between schools, districts, and provinces with drill-down capability.',
  NULL,
  'pending',
  NOW() - INTERVAL '8 days'
),
(
  'Irene Mukamwiza | Jean Habimana',
  'IPRC Kigali (University)',
  'irene.mukamwiza@iprc.ac.rw',
  'AgroDash — Farm Analytics',
  'Data Visualization',
  E'SECTOR: University\n\nTEAM MEMBERS: Irene Mukamwiza (irene.mukamwiza@iprc.ac.rw), Jean Habimana\n\nPROJECT DESCRIPTION: Agricultural data dashboard for MINAGRI showing crop production volumes, fertiliser usage, irrigation coverage, and seasonal trends across Rwanda\'s 30 districts. Features predictive overlays and exportable PDF reports.',
  'https://github.com/irene-mukamwiza/agrodash',
  'shortlisted',
  NOW() - INTERVAL '7 days'
),
(
  'Keza Mutoni | Leon Ndikumana | Marie Uwera',
  'ALU Rwanda (University)',
  'keza.mutoni@alurwanda.org',
  'PopuGrowth — Demographics Explorer',
  'Data Visualization',
  E'SECTOR: University\n\nTEAM MEMBERS: Keza Mutoni (keza.mutoni@alurwanda.org), Leon Ndikumana, Marie Uwera\n\nPROJECT DESCRIPTION: Interactive demographic visualisation tool using Rwanda 2022 Census data. Explore population pyramids, migration flows, urbanisation trends, and household statistics at cell level. Animated projections to 2050.',
  'https://github.com/keza-mutoni/popugrowth',
  'approved',
  NOW() - INTERVAL '7 days'
),
(
  'Noel Habineza | Odette Mukamana',
  'Kigali Independent University (University)',
  'noel.habineza@kiu.ac.rw',
  'EnergyFlow — Power Grid Monitor',
  'Data Visualization',
  E'SECTOR: University\n\nTEAM MEMBERS: Noel Habineza (noel.habineza@kiu.ac.rw), Odette Mukamana\n\nPROJECT DESCRIPTION: Real-time visualisation of Rwanda\'s electricity generation and distribution network. Shows renewable vs thermal generation mix, district-level consumption, load shedding events, and off-grid solar penetration. Data from REG.',
  'https://github.com/noel-habineza/energyflow',
  'reviewed',
  NOW() - INTERVAL '6 days'
),
(
  'Pierre Niyonsenga | Quirine Ingabire | Robert Gasana',
  'GS Kimironko (Secondary School)',
  'pierre.niyonsenga@gskimironko.rw',
  'WaterSense — WASH Dashboard',
  'Data Visualization',
  E'SECTOR: Secondary School\n\nTEAM MEMBERS: Pierre Niyonsenga (pierre.niyonsenga@gskimironko.rw), Quirine Ingabire, Robert Gasana\n\nPROJECT DESCRIPTION: Water and sanitation dashboard tracking access to clean water, latrine coverage, and hygiene indicators across Rwanda. Flags underserved areas for prioritisation. Built with data from WASAC and MININFRA.',
  NULL,
  'pending',
  NOW() - INTERVAL '5 days'
),
(
  'Sandrine Uwitonze | Thierry Nkurunziza',
  'Carnegie Mellon University Africa (University)',
  'sandrine.uwitonze@cmu.ac.rw',
  'TradeFlow — Import/Export Viz',
  'Data Visualization',
  E'SECTOR: University\n\nTEAM MEMBERS: Sandrine Uwitonze (sandrine.uwitonze@cmu.ac.rw), Thierry Nkurunziza\n\nPROJECT DESCRIPTION: Visualisation platform for Rwanda\'s trade data showing top trading partners, commodity flows, balance of trade trends, and EAC integration metrics. Interactive Sankey diagrams, maps, and time-series charts.',
  'https://github.com/sandrine-uwitonze/tradeflow',
  'pending',
  NOW() - INTERVAL '5 days'
),
(
  'Umulisa Nyirahabimana | Valens Tuyishime | Wanda Mukobwajana',
  'INES Ruhengeri (University)',
  'umulisa.nyirahabimana@ines.ac.rw',
  'CrimeMap — Safety Intelligence',
  'Data Visualization',
  E'SECTOR: University\n\nTEAM MEMBERS: Umulisa Nyirahabimana (umulisa.nyirahabimana@ines.ac.rw), Valens Tuyishime, Wanda Mukobwajana\n\nPROJECT DESCRIPTION: Public safety data platform aggregating reported incidents and RNP statistics into heat maps, trend charts, and neighbourhood safety scores. Helps citizens and urban planners make data-driven safety decisions.',
  'https://github.com/umulisa-nyirahabimana/crimemap',
  'rejected',
  NOW() - INTERVAL '4 days'
),
(
  'Xavier Twagirimana | Yolande Uwase',
  'University of Kigali (University)',
  'xavier.twagirimana@uk.ac.rw',
  'EcoTracker — Environment Monitor',
  'Data Visualization',
  E'SECTOR: University\n\nTEAM MEMBERS: Xavier Twagirimana (xavier.twagirimana@uk.ac.rw), Yolande Uwase\n\nPROJECT DESCRIPTION: Environmental monitoring dashboard tracking air quality (PM2.5, CO2), deforestation rates, wetland coverage, and biodiversity indices across Rwanda. Integrates satellite data with ground sensors deployed in 12 districts.',
  'https://github.com/xavier-twagirimana/ecotracker',
  'pending',
  NOW() - INTERVAL '3 days'
),

-- ── Cybersecurity ─────────────────────────────────────────────
(
  'Alexis Rutayisire | Bernadette Mukamusoni | Claude Nzeyimana',
  'Carnegie Mellon University Africa (University)',
  'alexis.rutayisire@cmu.ac.rw',
  'SecureRW — Cyber Threat Monitor',
  'Cybersecurity',
  E'SECTOR: University\n\nTEAM MEMBERS: Alexis Rutayisire (alexis.rutayisire@cmu.ac.rw), Bernadette Mukamusoni, Claude Nzeyimana\n\nPROJECT DESCRIPTION: National cybersecurity monitoring platform that aggregates threat intelligence feeds, tracks attack patterns targeting Rwandan institutions, and provides real-time alerts to RISA. Dashboard includes threat actor profiles and incident response playbooks.',
  'https://github.com/alexis-rutayisire/securerw',
  'winner',
  NOW() - INTERVAL '10 days'
),
(
  'Desire Uwamahoro | Emma Mukashyaka',
  'University of Rwanda (University)',
  'desire.uwamahoro@ur.ac.rw',
  'PhishDetect AI',
  'Cybersecurity',
  E'SECTOR: University\n\nTEAM MEMBERS: Desire Uwamahoro (desire.uwamahoro@ur.ac.rw), Emma Mukashyaka\n\nPROJECT DESCRIPTION: Browser extension and email plugin that detects phishing attempts and social engineering attacks targeting Rwandan users. Uses ML model trained on 50,000 local phishing samples. Supports Kinyarwanda and French warning messages.',
  'https://github.com/desire-uwamahoro/phishdetect',
  'approved',
  NOW() - INTERVAL '9 days'
),
(
  'Florian Nkurunziza | Gaelle Uwimana | Henri Bizimana',
  'GS Gikondo (Secondary School)',
  'florian.nkurunziza@gsgikondo.rw',
  'BlockChain ID — Digital Identity',
  'Cybersecurity',
  E'SECTOR: Secondary School\n\nTEAM MEMBERS: Florian Nkurunziza (florian.nkurunziza@gsgikondo.rw), Gaelle Uwimana, Henri Bizimana\n\nPROJECT DESCRIPTION: Decentralised digital identity system built on a permissioned blockchain, allowing Rwandan citizens to control and share their credentials (ID, education certificates, health records) without central point of failure.',
  'https://github.com/florian-nkurunziza/blockchainid',
  'shortlisted',
  NOW() - INTERVAL '8 days'
),
(
  'Immaculee Nyiraneza | Joel Hakizimana',
  'Rwanda Polytechnic (University)',
  'immaculee.nyiraneza@rp.ac.rw',
  'CryptoVault — Secure File Storage',
  'Cybersecurity',
  E'SECTOR: University\n\nTEAM MEMBERS: Immaculee Nyiraneza (immaculee.nyiraneza@rp.ac.rw), Joel Hakizimana\n\nPROJECT DESCRIPTION: End-to-end encrypted file storage and sharing system for government documents and personal records. Uses AES-256 encryption with user-controlled keys, zero-knowledge proofs for access control, and GDPR-compliant audit trails.',
  'https://github.com/immaculee-nyiraneza/cryptovault',
  'approved',
  NOW() - INTERVAL '7 days'
),
(
  'Kevin Mugabekazi | Laetitia Uwera | Michel Nsengimana',
  'ALU Rwanda (University)',
  'kevin.mugabekazi@alurwanda.org',
  'NetworkGuard — Intrusion Detection',
  'Cybersecurity',
  E'SECTOR: University\n\nTEAM MEMBERS: Kevin Mugabekazi (kevin.mugabekazi@alurwanda.org), Laetitia Uwera, Michel Nsengimana\n\nPROJECT DESCRIPTION: AI-powered network intrusion detection system for SMEs and government agencies. Uses anomaly detection algorithms to identify zero-day attacks, DDoS patterns, and insider threats in real-time with sub-second response.',
  'https://github.com/kevin-mugabekazi/networkguard',
  'reviewed',
  NOW() - INTERVAL '7 days'
),
(
  'Nadia Mukasine | Olivier Nkurunziza',
  'IPRC Kigali (University)',
  'nadia.mukasine@iprc.ac.rw',
  'DataShield — Privacy Manager',
  'Cybersecurity',
  E'SECTOR: University\n\nTEAM MEMBERS: Nadia Mukasine (nadia.mukasine@iprc.ac.rw), Olivier Nkurunziza\n\nPROJECT DESCRIPTION: Personal data privacy management tool that scans apps on a user\'s device for excessive permissions, data leakage risks, and non-compliance with Rwanda\'s data protection law. Generates privacy health reports and automated opt-out requests.',
  NULL,
  'pending',
  NOW() - INTERVAL '6 days'
),
(
  'Priscilla Mukamana | Quentin Habimana | Rita Uwitonze',
  'GS Remera (Secondary School)',
  'priscilla.mukamana@gsremera.rw',
  'MobileSecure — Device Scanner',
  'Cybersecurity',
  E'SECTOR: Secondary School\n\nTEAM MEMBERS: Priscilla Mukamana (priscilla.mukamana@gsremera.rw), Quentin Habimana, Rita Uwitonze\n\nPROJECT DESCRIPTION: Mobile security scanner that checks Android and iOS devices for malware, outdated apps, dangerous configurations, and stolen credentials. Lightweight enough to run on low-spec devices common in Rwanda.',
  'https://github.com/priscilla-mukamana/mobilesecure',
  'pending',
  NOW() - INTERVAL '5 days'
),
(
  'Serge Nzabonimana | Therese Ingabire',
  'Kigali Independent University (University)',
  'serge.nzabonimana@kiu.ac.rw',
  'AccessControl — Biometric Auth',
  'Cybersecurity',
  E'SECTOR: University\n\nTEAM MEMBERS: Serge Nzabonimana (serge.nzabonimana@kiu.ac.rw), Therese Ingabire\n\nPROJECT DESCRIPTION: Biometric access control system combining fingerprint, face recognition, and liveness detection for government offices and secure facilities. Runs on Raspberry Pi hardware, works offline, and logs access events to a tamper-proof ledger.',
  'https://github.com/serge-nzabonimana/accesscontrol',
  'pending',
  NOW() - INTERVAL '4 days'
),
(
  'Ursule Munezero | Vincent Nsabimana | Wendy Kayitesi',
  'INES Ruhengeri (University)',
  'ursule.munezero@ines.ac.rw',
  'ThreatHunter — Malware Analyst',
  'Cybersecurity',
  E'SECTOR: University\n\nTEAM MEMBERS: Ursule Munezero (ursule.munezero@ines.ac.rw), Vincent Nsabimana, Wendy Kayitesi\n\nPROJECT DESCRIPTION: Automated malware analysis sandbox that executes suspicious files in isolation, captures behaviour, and generates threat intelligence reports. Built for RISA analysts. Supports Windows, Android, and Linux samples.',
  'https://github.com/ursule-munezero/threathunter',
  'rejected',
  NOW() - INTERVAL '4 days'
),
(
  'Xavier Mugisha | Yvette Twagirayezu',
  'University of Kigali (University)',
  'xavier.mugisha@uk.ac.rw',
  'SecureComm — Encrypted Messaging',
  'Cybersecurity',
  E'SECTOR: University\n\nTEAM MEMBERS: Xavier Mugisha (xavier.mugisha@uk.ac.rw), Yvette Twagirayezu\n\nPROJECT DESCRIPTION: End-to-end encrypted messaging app for government officials and corporate teams. Uses Signal Protocol for message encryption, metadata minimisation, and self-destructing messages. Compliant with Rwanda\'s cybersecurity regulations.',
  'https://github.com/xavier-mugisha/securecomm',
  'pending',
  NOW() - INTERVAL '3 days'
);

-- ============================================================
-- 2. MESSAGES (10 contact form submissions)
-- ============================================================

INSERT INTO public.messages (name, email, subject, message, is_read, created_at)
VALUES
(
  'Jean-Pierre Nzeyimana',
  'jeanpierre.nzeyimana@gmail.com',
  'Question about submission deadline',
  'Hello, I wanted to confirm whether the submission deadline of April 9th is strict or if there is any grace period for teams that are still finalising their projects. Our team has been working very hard on our AI project and we want to make sure we submit on time. Thank you.',
  true,
  NOW() - INTERVAL '8 days'
),
(
  'Marie-Claire Uwamahoro',
  'marieclaire.uwamahoro@ur.ac.rw',
  'Team size clarification',
  'Good afternoon. Our team currently has 4 members and we are considering adding a 5th member who is a graphic designer. The rules mention a maximum team size of 5. Can you confirm whether this includes all roles such as designers, or only technical members? Thank you for your response.',
  true,
  NOW() - INTERVAL '7 days'
),
(
  'Celestin Hakizimana',
  'celestin.hakizimana@iprc.ac.rw',
  'Eligible categories for our project',
  'Hi, our project uses machine learning to visualise disease patterns on a map. We are unsure whether to submit it under "AI & ML" or "Data Visualization". Could you advise us on which category would be most appropriate? We do not want to be disqualified for wrong categorisation.',
  false,
  NOW() - INTERVAL '6 days'
),
(
  'Solange Ineza',
  'solange.ineza@gmail.com',
  'Secondary school student eligibility',
  'I am a Senior 6 student at GS Remera and I would like to participate with two classmates. We have been working on a cybersecurity project for the past month. I just want to confirm that secondary school students are allowed to participate and compete for prizes. Thank you.',
  false,
  NOW() - INTERVAL '5 days'
),
(
  'Patrick Rutayisire',
  'patrick.rutayisire@cmu.ac.rw',
  'Can we use external APIs in our project?',
  'Our project integrates with the Google Maps API and the OpenAI API for some features. Is there any restriction on using external third-party APIs or cloud services? We want to be transparent about our technology stack. Please advise.',
  true,
  NOW() - INTERVAL '5 days'
),
(
  'Diane Mukagasana',
  'diane.mukagasana@alurwanda.org',
  'Hardware and demonstration equipment',
  'Hello team. For the hackathon presentation day, our project includes a hardware component — a Raspberry Pi connected to sensors. Will there be power sockets and a table available for hardware demonstrations? We also need to know if we can ship equipment in advance.',
  false,
  NOW() - INTERVAL '4 days'
),
(
  'Emmanuel Bizimana',
  'emmanuel.bizimana@rp.ac.rw',
  'Project submitted but no confirmation email',
  'Good morning. I submitted our project two days ago through the website form but I have not received any confirmation email. Our project title is "SoilSense ML". Could you please verify that our submission was received and confirm the submission ID? Thank you.',
  true,
  NOW() - INTERVAL '3 days'
),
(
  'Honorine Kayitesi',
  'honorine.kayitesi@gmail.com',
  'Judging criteria and scoring weights',
  'Hello, I read the information on the website but I could not find the specific weights for each judging criterion — innovation, impact, technical quality, and relevance. Could you share the scoring rubric so we can best prepare our presentation? Thank you for the great event.',
  false,
  NOW() - INTERVAL '3 days'
),
(
  'Thierry Nkurikiyimana',
  'thierry.nkurikiyimana@ines.ac.rw',
  'Presentation format and time limit',
  'Hi there, I would like to know the expected presentation format for the final day. How many minutes does each team have? Do we need slides or is a live demo preferred? Will there be a projector available? Looking forward to the event.',
  false,
  NOW() - INTERVAL '2 days'
),
(
  'Vestine Mukamurenzi',
  'vestine.mukamurenzi@uk.ac.rw',
  'Prize distribution and certificates',
  'Hello, congratulations on organising this wonderful initiative. I would like to know whether all participating teams will receive certificates, or only the winners. Also, will the prizes be awarded on the same day as the final presentations or at a separate ceremony? Thank you.',
  false,
  NOW() - INTERVAL '1 day'
);

-- ============================================================
-- Staff accounts are created via the Node.js seed script:
--   node supabase/seed-staff.js
-- Supabase SQL Editor does not allow direct writes to auth.users.
-- ============================================================
