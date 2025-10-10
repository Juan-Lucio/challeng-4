// src/utils/importCSV.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/tattler_db';
const csvPath = path.join(__dirname, '..', '..', 'data', 'restaurants.csv');

(async () => {
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection;
    const docs = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        docs.push({
          name: row.name,
          address: row.address,
          phone: row.phone,
          cuisine: row.cuisine,
          website: row.website,
          location: { type: 'Point', coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)] },
          ratings: [],
          averageRating: 0,
          comments: [],
          createdAt: row.createdAt ? new Date(row.createdAt) : new Date()
        });
      })
      .on('end', async () => {
        if (docs.length === 0) {
          console.log('No rows found in CSV');
          process.exit(0);
        }
        await db.collection('restaurants').insertMany(docs);
        console.log(`Imported ${docs.length} documents into restaurants`);
        process.exit(0);
      });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
