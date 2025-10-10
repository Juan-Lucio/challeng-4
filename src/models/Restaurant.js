const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userName: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const ratingSchema = new mongoose.Schema({
  userName: String,
  score: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  phone: String,
  cuisine: String,
  website: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number]
  },
  comments: [commentSchema],
  ratings: [ratingSchema],
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ name: 'text', cuisine: 'text', address: 'text' });

restaurantSchema.methods.recalculateAverage = function() {
  if (this.ratings.length === 0) this.averageRating = 0;
  else {
    this.averageRating =
      this.ratings.reduce((a, r) => a + r.score, 0) / this.ratings.length;
  }
};

module.exports = mongoose.model('Restaurant', restaurantSchema);
