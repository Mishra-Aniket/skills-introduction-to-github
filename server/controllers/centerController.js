const Center = require('../models/Center');

// Create new center
const createCenter = async (req, res) => {
  try {
    const { name, address, city, state, pincode, contactEmail, contactPhone } = req.body;

    const center = new Center({
      name,
      address,
      city,
      state,
      pincode,
      contactEmail,
      contactPhone
    });

    await center.save();

    res.status(201).json({
      message: 'Center created successfully',
      center
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all centers
const getAllCenters = async (req, res) => {
  try {
    const { isActive } = req.query;
    const query = {};
    // Sanitize isActive input
    if (isActive !== undefined) {
      query.isActive = String(isActive) === 'true';
    }

    const centers = await Center.find(query).sort({ name: 1 });

    res.json({ centers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single center
const getCenter = async (req, res) => {
  try {
    const { centerId } = req.params;

    const center = await Center.findById(centerId);
    if (!center) {
      return res.status(404).json({ error: 'Center not found' });
    }

    res.json({ center });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update center
const updateCenter = async (req, res) => {
  try {
    const { centerId } = req.params;
    const updates = req.body;

    const center = await Center.findByIdAndUpdate(
      centerId,
      updates,
      { new: true, runValidators: true }
    );

    if (!center) {
      return res.status(404).json({ error: 'Center not found' });
    }

    res.json({
      message: 'Center updated successfully',
      center
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete center (soft delete)
const deleteCenter = async (req, res) => {
  try {
    const { centerId } = req.params;

    const center = await Center.findByIdAndUpdate(
      centerId,
      { isActive: false },
      { new: true }
    );

    if (!center) {
      return res.status(404).json({ error: 'Center not found' });
    }

    res.json({
      message: 'Center deactivated successfully',
      center
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCenter,
  getAllCenters,
  getCenter,
  updateCenter,
  deleteCenter
};
