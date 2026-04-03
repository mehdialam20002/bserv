const prisma = require('../config/prisma');

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { machines: true } } },
      orderBy: { name: 'asc' },
    });

    const data = categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image_url: c.imageUrl,
      created_at: c.createdAt,
      machine_count: c._count.machines,
    }));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findUnique({ where: { slug } });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({
      success: true,
      data: {
        ...category,
        image_url: category.imageUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCategories, getCategory };
