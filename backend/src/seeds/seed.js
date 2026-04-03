const prisma = require('../config/prisma');

const seedData = async () => {
  try {
    console.log('Clearing existing data...');
    await prisma.review.deleteMany();
    await prisma.order.deleteMany();
    await prisma.inquiry.deleteMany();
    await prisma.contactMessage.deleteMany();
    await prisma.machine.deleteMany();
    await prisma.category.deleteMany();

    console.log('Seeding categories...');
    const categories = await Promise.all([
      prisma.category.create({ data: { name: 'Multifunction Photocopiers', slug: 'multifunction-photocopiers', description: 'All-in-one print, copy, scan and fax machines', imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400' } }),
      prisma.category.create({ data: { name: 'Black & White Copiers', slug: 'bw-copiers', description: 'High-speed monochrome photocopier machines', imageUrl: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=400' } }),
      prisma.category.create({ data: { name: 'Color Photocopiers', slug: 'color-photocopiers', description: 'Professional color copying and printing machines', imageUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=400' } }),
      prisma.category.create({ data: { name: 'Heavy Duty Copiers', slug: 'heavy-duty-copiers', description: 'High volume production copiers for large offices', imageUrl: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400' } }),
      prisma.category.create({ data: { name: 'Reconditioned Copiers', slug: 'reconditioned-copiers', description: 'Certified refurbished machines at great prices', imageUrl: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=400' } }),
      prisma.category.create({ data: { name: 'Large Format Printers', slug: 'large-format-printers', description: 'Wide format plotters and printers', imageUrl: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=400' } }),
    ]);

    const catMap = {};
    categories.forEach(c => { catMap[c.slug] = c.id; });

    console.log('Seeding machines...');
    const machines = [
      {
        name: 'Konica Minolta Bizhub 205i', slug: 'konica-minolta-bizhub-205i', brand: 'Konica Minolta',
        categoryId: catMap['multifunction-photocopiers'],
        description: 'The Konica Minolta Bizhub 205i is a reliable A3 monochrome multifunction printer ideal for small to medium offices. It offers fast printing at 20 ppm, scanning, copying, and optional fax capabilities with a compact footprint.',
        features: ['20 ppm Print Speed', 'A3 Support', 'Duplex Printing', 'Network Ready', '600x600 dpi', 'USB & LAN Connectivity', '250 Sheet Tray', 'Scan to Email/FTP'],
        specifications: { print_speed: '20 ppm', resolution: '600x600 dpi', paper_size: 'A3-A5', memory: '256 MB', duty_cycle: '30,000 pages/month', warm_up: '20 seconds', weight: '26 kg' },
        price: 46000, rentPriceMonthly: 3500, rentPriceYearly: 36000,
        condition: 'new', thumbnail: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500',
        images: ['https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800'],
        rating: 4.2, reviewCount: 45,
      },
      {
        name: 'Canon imageRUNNER 2625i', slug: 'canon-imagerunner-2625i', brand: 'Canon',
        categoryId: catMap['multifunction-photocopiers'],
        description: 'Canon imageRUNNER 2625i delivers exceptional print quality with 25 ppm speed. Features advanced scanning capabilities, mobile connectivity, and robust security features perfect for modern workplaces.',
        features: ['25 ppm Print Speed', 'A3 Support', 'Auto Duplex', 'WiFi & NFC', '1200x1200 dpi', 'Cloud Connectivity', '550 Sheet Cassette', 'Touch Panel Display'],
        specifications: { print_speed: '25 ppm', resolution: '1200x1200 dpi', paper_size: 'A3-A5', memory: '2 GB', duty_cycle: '75,000 pages/month', warm_up: '14 seconds', weight: '35 kg' },
        price: 85000, rentPriceMonthly: 5500, rentPriceYearly: 58000,
        condition: 'new', thumbnail: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=500',
        images: ['https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800'],
        rating: 4.5, reviewCount: 68,
      },
      {
        name: 'Xerox B1025', slug: 'xerox-b1025', brand: 'Xerox',
        categoryId: catMap['bw-copiers'],
        description: 'Xerox B1025 multifunction printer offers fast, reliable black & white printing and copying at an affordable price. With 25 ppm speed and robust paper handling, it is built for demanding environments.',
        features: ['25 ppm Speed', 'A3 Print/Copy', 'Duplex ADF', 'Network Scan', '600x600 dpi', 'Secure Print', '350 Sheet Input', 'Energy Star Certified'],
        specifications: { print_speed: '25 ppm', resolution: '600x600 dpi', paper_size: 'A3-A5', memory: '1 GB', duty_cycle: '50,000 pages/month', warm_up: '16 seconds', weight: '30 kg' },
        price: 80000, rentPriceMonthly: 5000, rentPriceYearly: 52000,
        condition: 'new', thumbnail: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500',
        images: ['https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800'],
        rating: 4.0, reviewCount: 32,
      },
      {
        name: 'Ricoh MP 2014AD', slug: 'ricoh-mp-2014ad', brand: 'Ricoh',
        categoryId: catMap['bw-copiers'],
        description: 'Ricoh MP 2014AD is a compact yet powerful A3 monochrome multifunction device. With auto duplex and network printing, it is perfect for growing businesses that need reliable document management.',
        features: ['20 ppm Print Speed', 'Auto Duplex', 'Network Ready', 'GW Security', '600x600 dpi', 'ID Card Copy', '250 Sheet Tray', 'Low Power Consumption'],
        specifications: { print_speed: '20 ppm', resolution: '600x600 dpi', paper_size: 'A3-A5', memory: '256 MB', duty_cycle: '20,000 pages/month', warm_up: '22 seconds', weight: '23 kg' },
        price: 38000, rentPriceMonthly: 2800, rentPriceYearly: 30000,
        condition: 'new', thumbnail: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500',
        images: ['https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800'],
        rating: 4.1, reviewCount: 55,
      },
      {
        name: 'Konica Minolta Bizhub C258', slug: 'konica-minolta-bizhub-c258', brand: 'Konica Minolta',
        categoryId: catMap['color-photocopiers'],
        description: 'The Bizhub C258 delivers stunning color output at 25 ppm. Its intuitive touchscreen, mobile print support, and advanced security make it the perfect hub for modern color document workflows.',
        features: ['25 ppm Color & B/W', 'A3 Color Print', '9" Touchscreen', 'Mobile Print', '1800x600 dpi', 'Staple/Fold Finisher', '1150 Sheet Input', 'Scan to Cloud'],
        specifications: { print_speed: '25 ppm', resolution: '1800x600 dpi', paper_size: 'A3-A6', memory: '4 GB', duty_cycle: '120,000 pages/month', warm_up: '18 seconds', weight: '67 kg' },
        price: 250000, rentPriceMonthly: 12000, rentPriceYearly: 130000,
        condition: 'new', thumbnail: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=500',
        images: ['https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800'],
        rating: 4.7, reviewCount: 89,
      },
      {
        name: 'Canon imageRUNNER C3226i', slug: 'canon-imagerunner-c3226i', brand: 'Canon',
        categoryId: catMap['color-photocopiers'],
        description: 'Canon imageRUNNER C3226i provides brilliant color prints at 26 ppm with an intuitive user experience. Advanced cloud integration and fleet management capabilities make it ideal for modern enterprises.',
        features: ['26 ppm Color Print', 'A3 Support', '10.1" Touchscreen', 'Cloud Direct Print', '1200x1200 dpi', 'Universal Login Manager', '1200 Sheet Capacity', 'Optional WiFi'],
        specifications: { print_speed: '26 ppm', resolution: '1200x1200 dpi', paper_size: 'A3-A5', memory: '3.5 GB', duty_cycle: '95,000 pages/month', warm_up: '15 seconds', weight: '72 kg' },
        price: 320000, rentPriceMonthly: 15000, rentPriceYearly: 160000,
        condition: 'new', thumbnail: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500',
        images: ['https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800'],
        rating: 4.6, reviewCount: 41,
      },
      {
        name: 'Xerox AltaLink B8170', slug: 'xerox-altalink-b8170', brand: 'Xerox',
        categoryId: catMap['heavy-duty-copiers'],
        description: 'The Xerox AltaLink B8170 is built for high-volume environments producing up to 70 ppm. ConnectKey technology enables seamless integration with cloud and mobile workflows.',
        features: ['70 ppm Speed', 'A3 Support', '10.1" Smart Display', 'ConnectKey Tech', '1200x1200 dpi', 'Booklet Making', '5140 Sheet Capacity', 'Xerox App Gallery'],
        specifications: { print_speed: '70 ppm', resolution: '1200x1200 dpi', paper_size: 'SRA3-A5', memory: '8 GB', duty_cycle: '300,000 pages/month', warm_up: '10 seconds', weight: '128 kg' },
        price: 650000, rentPriceMonthly: 28000, rentPriceYearly: 300000,
        condition: 'new', thumbnail: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500',
        images: ['https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800'],
        rating: 4.8, reviewCount: 27,
      },
      {
        name: 'Ricoh IM 9000', slug: 'ricoh-im-9000', brand: 'Ricoh',
        categoryId: catMap['heavy-duty-copiers'],
        description: 'Ricoh IM 9000 is a production-level monochrome MFP delivering 90 ppm. RICOH Always Current Technology ensures your device evolves with firmware updates and new features.',
        features: ['90 ppm Speed', 'A3 Support', 'RICOH Smart Integration', 'Always Current Tech', '1200x1200 dpi', 'Multi-fold Unit', '8300 Sheet Capacity', 'Voice Guidance'],
        specifications: { print_speed: '90 ppm', resolution: '1200x1200 dpi', paper_size: 'A3-A5', memory: '8 GB SSD', duty_cycle: '500,000 pages/month', warm_up: '12 seconds', weight: '145 kg' },
        price: 850000, rentPriceMonthly: 35000, rentPriceYearly: 380000,
        condition: 'new', thumbnail: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=500',
        images: ['https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800'],
        rating: 4.9, reviewCount: 18,
      },
      {
        name: 'Konica Minolta Bizhub 225i (Refurbished)', slug: 'konica-minolta-bizhub-225i-refurbished', brand: 'Konica Minolta',
        categoryId: catMap['reconditioned-copiers'],
        description: 'Certified refurbished Bizhub 225i in excellent condition with new drum and toner. All functions tested and verified. Comes with 6-month warranty.',
        features: ['22 ppm Speed', 'A3 Support', 'Duplex Standard', 'Network Ready', '600x600 dpi', '6-Month Warranty', 'New Drum Installed', 'Fully Serviced'],
        specifications: { print_speed: '22 ppm', resolution: '600x600 dpi', paper_size: 'A3-A5', memory: '512 MB', duty_cycle: '30,000 pages/month', warm_up: '20 seconds', weight: '28 kg' },
        price: 22000, rentPriceMonthly: 1800, rentPriceYearly: 18000,
        condition: 'refurbished', thumbnail: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500',
        images: ['https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800'],
        rating: 3.9, reviewCount: 63,
      },
      {
        name: 'Canon imageRUNNER 2206N (Refurbished)', slug: 'canon-imagerunner-2206n-refurbished', brand: 'Canon',
        categoryId: catMap['reconditioned-copiers'],
        description: 'Refurbished Canon iR 2206N with new imaging unit. Compact, efficient, and budget-friendly option for startups and small offices. Comes with 3-month warranty.',
        features: ['22 ppm Speed', 'A3 Print/Copy', 'WiFi Ready', 'USB Direct Print', '600x600 dpi', '3-Month Warranty', 'New Imaging Unit', 'Tested & Certified'],
        specifications: { print_speed: '22 ppm', resolution: '600x600 dpi', paper_size: 'A3-A5', memory: '256 MB', duty_cycle: '20,000 pages/month', warm_up: '18 seconds', weight: '25 kg' },
        price: 18000, rentPriceMonthly: 1500, rentPriceYearly: 15000,
        condition: 'refurbished', thumbnail: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500',
        images: ['https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800'],
        rating: 3.7, reviewCount: 48,
      },
      {
        name: 'HP DesignJet T650 36-inch', slug: 'hp-designjet-t650-36', brand: 'HP',
        categoryId: catMap['large-format-printers'],
        description: 'HP DesignJet T650 large format plotter with 36-inch printing capability. Perfect for architectural plans, engineering drawings, and marketing posters with excellent line accuracy.',
        features: ['36" Print Width', 'WiFi & Ethernet', 'Auto Sheet Feeder', 'HP Click Software', '2400x1200 dpi', 'Roll & Sheet Feed', '1 GB Memory', 'Energy Star'],
        specifications: { print_speed: '26 sec/page A1', resolution: '2400x1200 dpi', paper_size: 'Up to 36 inches', memory: '1 GB', ink_system: '4-color', media_handling: 'Roll + Sheet', weight: '27 kg' },
        price: 175000, rentPriceMonthly: 9000, rentPriceYearly: 95000,
        condition: 'new', thumbnail: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=500',
        images: ['https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800'],
        rating: 4.4, reviewCount: 22,
      },
      {
        name: 'Sharp BP-70M45', slug: 'sharp-bp-70m45', brand: 'Sharp',
        categoryId: catMap['multifunction-photocopiers'],
        description: 'Sharp BP-70M45 offers 45 ppm speed with an advanced 10.1" color touchscreen display. Features cloud connectivity, wireless printing, and comprehensive security for mid-size offices.',
        features: ['45 ppm Speed', 'A3 Support', '10.1" Color Touch', 'Cloud Connect', '1200x1200 dpi', 'Retractable Keyboard', '6300 Sheet Max', 'Sharp OSA Platform'],
        specifications: { print_speed: '45 ppm', resolution: '1200x1200 dpi', paper_size: 'SRA3-A5', memory: '5 GB', duty_cycle: '200,000 pages/month', warm_up: '15 seconds', weight: '75 kg' },
        price: 380000, rentPriceMonthly: 18000, rentPriceYearly: 190000,
        condition: 'new', thumbnail: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500',
        images: ['https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800'],
        rating: 4.3, reviewCount: 36,
      },
    ];

    for (const m of machines) {
      await prisma.machine.create({ data: m });
    }

    console.log('Seed data inserted successfully!');
    console.log(`- 6 categories`);
    console.log(`- ${machines.length} machines`);

    await prisma.$disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

seedData();
