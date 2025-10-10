// src/controllers/restaurantController.js
const Restaurant = require('../models/Restaurant');

exports.createRestaurant = async (req, res, next) => {
  try {
    const r = new Restaurant(req.body);
    await r.save();
    return res.status(201).json(r);
  } catch (err) {
    return next(err);
  }
};

exports.getRestaurants = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '10')));
    const skip = (page - 1) * limit;
    const docs = await Restaurant.find().skip(skip).limit(limit).lean();
    const total = await Restaurant.countDocuments();
    return res.json({ data: docs, page, limit, total });
  } catch (err) {
    return next(err);
  }
};

exports.getRestaurantById = async (req, res, next) => {
  try {
    const r = await Restaurant.findById(req.params.id).lean();
    if (!r) return res.status(404).json({ message: 'Not found' });
    return res.json(r);
  } catch (err) {
    return next(err);
  }
};

exports.updateRestaurant = async (req, res, next) => {
  try {
    const r = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!r) return res.status(404).json({ message: 'Not found' });
    return res.json(r);
  } catch (err) {
    return next(err);
  }
};

exports.deleteRestaurant = async (req, res, next) => {
  try {
    const r = await Restaurant.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { userName, content } = req.body;
    const r = await Restaurant.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    r.comments.push({ userName, content });
    await r.save();
    return res.status(201).json(r);
  } catch (err) {
    return next(err);
  }
};

exports.addRating = async (req, res, next) => {
  try {
    const { userName, score } = req.body;
    if (!score || score < 1 || score > 5) return res.status(400).json({ message: 'score must be 1-5' });
    const r = await Restaurant.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });
    r.ratings.push({ userName, score });
    await r.save();
    return res.status(201).json(r);
  } catch (err) {
    return next(err);
  }
};
