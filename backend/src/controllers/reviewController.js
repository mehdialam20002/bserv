const prisma = require('../config/prisma');

const createReview = async (req, res) => {
  try {
    const { machine_id, name, email, rating, comment } = req.body;

    if (!machine_id || !name || !email || !rating) {
      return res.status(400).json({ success: false, message: 'Machine ID, name, email and rating are required' });
    }

    const review = await prisma.review.create({
      data: {
        machineId: machine_id,
        name,
        email,
        rating,
        comment: comment || null,
      },
    });

    // Update machine average rating
    const stats = await prisma.review.aggregate({
      where: { machineId: machine_id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await prisma.machine.update({
      where: { id: machine_id },
      data: {
        rating: Math.round(stats._avg.rating * 10) / 10,
        reviewCount: stats._count.rating,
      },
    });

    res.status(201).json({ success: true, data: review, message: 'Review submitted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createReview };
