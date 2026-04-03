const prisma = require('../config/prisma');

const createInquiry = async (req, res) => {
  try {
    const { machine_id, name, email, phone, company, message, inquiry_type } = req.body;

    if (!name || !email || !phone || !inquiry_type) {
      return res.status(400).json({ success: false, message: 'Name, email, phone, and inquiry type are required' });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        machineId: machine_id || null,
        name,
        email,
        phone,
        company: company || null,
        message: message || null,
        inquiryType: inquiry_type,
      },
    });

    res.status(201).json({ success: true, data: inquiry, message: 'Inquiry submitted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getInquiries = async (req, res) => {
  try {
    const inquiries = await prisma.inquiry.findMany({
      include: { machine: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const data = inquiries.map(i => ({
      ...i,
      machine_name: i.machine?.name || null,
    }));

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createInquiry, getInquiries };
