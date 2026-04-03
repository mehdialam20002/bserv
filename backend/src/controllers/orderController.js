const prisma = require('../config/prisma');
const { v4: uuidv4 } = require('uuid');

const createOrder = async (req, res) => {
  try {
    const { machine_id, customer_name, customer_email, customer_phone, customer_company, customer_address, order_type, rent_duration_months, notes } = req.body;

    if (!machine_id || !customer_name || !customer_email || !customer_phone || !customer_address || !order_type) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    const machine = await prisma.machine.findUnique({ where: { id: machine_id } });
    if (!machine) {
      return res.status(404).json({ success: false, message: 'Machine not found' });
    }

    let totalAmount;

    if (order_type === 'buy') {
      if (!machine.isAvailableForSale) {
        return res.status(400).json({ success: false, message: 'Machine is not available for sale' });
      }
      totalAmount = machine.price;
    } else if (order_type === 'rent') {
      if (!machine.isAvailableForRent) {
        return res.status(400).json({ success: false, message: 'Machine is not available for rent' });
      }
      const months = rent_duration_months || 1;
      totalAmount = parseFloat(machine.rentPriceMonthly) * months;
    } else {
      return res.status(400).json({ success: false, message: 'Invalid order type' });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: 'ORD-' + uuidv4().slice(0, 8).toUpperCase(),
        machineId: machine_id,
        customerName: customer_name,
        customerEmail: customer_email,
        customerPhone: customer_phone,
        customerCompany: customer_company || null,
        customerAddress: customer_address,
        orderType: order_type,
        rentDurationMonths: rent_duration_months || null,
        totalAmount,
        notes: notes || null,
      },
    });

    res.status(201).json({ success: true, data: order, message: 'Order placed successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { machine: { select: { name: true, thumbnail: true } } },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      data: {
        ...order,
        machine_name: order.machine?.name || null,
        thumbnail: order.machine?.thumbnail || null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, getOrder };
