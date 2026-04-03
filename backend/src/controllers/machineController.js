const prisma = require('../config/prisma');

// Map Prisma camelCase to snake_case for frontend
const mapMachine = (m) => ({
  id: m.id,
  name: m.name,
  slug: m.slug,
  brand: m.brand,
  category_id: m.categoryId,
  description: m.description,
  features: m.features,
  specifications: m.specifications,
  price: m.price ? Number(m.price) : null,
  rent_price_monthly: m.rentPriceMonthly ? Number(m.rentPriceMonthly) : null,
  rent_price_yearly: m.rentPriceYearly ? Number(m.rentPriceYearly) : null,
  is_available_for_sale: m.isAvailableForSale,
  is_available_for_rent: m.isAvailableForRent,
  condition: m.condition,
  images: m.images,
  thumbnail: m.thumbnail,
  rating: m.rating ? Number(m.rating) : 0,
  review_count: m.reviewCount,
  created_at: m.createdAt,
  updated_at: m.updatedAt,
  category_name: m.category?.name || null,
  category_slug: m.category?.slug || null,
});

// Get all machines with filters
const getMachines = async (req, res) => {
  try {
    const { category, brand, condition, min_price, max_price, search, sort, page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const where = {};

    if (category) {
      where.category = { slug: category };
    }
    if (brand) {
      where.brand = { equals: brand, mode: 'insensitive' };
    }
    if (condition) {
      where.condition = condition;
    }
    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price.gte = parseFloat(min_price);
      if (max_price) where.price.lte = parseFloat(max_price);
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_low') orderBy = { price: 'asc' };
    if (sort === 'price_high') orderBy = { price: 'desc' };
    if (sort === 'rating') orderBy = { rating: 'desc' };
    if (sort === 'name') orderBy = { name: 'asc' };

    const [machines, total] = await Promise.all([
      prisma.machine.findMany({
        where,
        include: { category: { select: { name: true, slug: true } } },
        orderBy,
        skip: parseInt(skip),
        take: parseInt(limit),
      }),
      prisma.machine.count({ where }),
    ]);

    res.json({
      success: true,
      data: machines.map(mapMachine),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single machine by slug
const getMachine = async (req, res) => {
  try {
    const { slug } = req.params;

    const machine = await prisma.machine.findUnique({
      where: { slug },
      include: {
        category: { select: { name: true, slug: true } },
        reviews: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!machine) {
      return res.status(404).json({ success: false, message: 'Machine not found' });
    }

    // Get related machines
    const relatedRaw = await prisma.machine.findMany({
      where: { categoryId: machine.categoryId, id: { not: machine.id } },
      include: { category: { select: { name: true, slug: true } } },
      take: 4,
    });

    res.json({
      success: true,
      data: {
        ...mapMachine(machine),
        reviews: machine.reviews,
        related_machines: relatedRaw.map(mapMachine),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get featured machines
const getFeatured = async (req, res) => {
  try {
    const machines = await prisma.machine.findMany({
      include: { category: { select: { name: true, slug: true } } },
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      take: 8,
    });

    res.json({ success: true, data: machines.map(mapMachine) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all brands
const getBrands = async (req, res) => {
  try {
    const machines = await prisma.machine.findMany({
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    });
    res.json({ success: true, data: machines.map(m => m.brand) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getMachines, getMachine, getFeatured, getBrands };
