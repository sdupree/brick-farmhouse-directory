const House = require('../models/house');

module.exports = { map };

async function map(req, res) {
  const houses = await House.find({});
  res.render('map/map', { title: 'House Map', houses });
}