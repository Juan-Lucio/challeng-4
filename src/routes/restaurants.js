// src/routes/restaurants.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/restaurantcontroller');

router.post('/', ctrl.createRestaurant);
router.get('/', ctrl.getRestaurants);
router.get('/:id', ctrl.getRestaurantById);
router.put('/:id', ctrl.updateRestaurant);
router.delete('/:id', ctrl.deleteRestaurant);
router.post('/:id/comments', ctrl.addComment);
router.post('/:id/ratings', ctrl.addRating);

module.exports = router;
