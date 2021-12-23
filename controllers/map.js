const House = require('../models/house');

module.exports = { map };

async function map(req, res) {
  const houses = await House.find({});
  res.locals.page = 'map';

  const lats = [];
  const lons = [];

  // Build array of lats, and array of lons.
  for(house of houses) {
    const latLon = house.latLon.split(',');
    lats.push(parseFloat(latLon[0]));
    lons.push(parseFloat(latLon[1]));
  }

  // Organize.
  lats.sort();
  lons.sort();

  const bounds = {
    // Grab highest and lowest of each.
    north: lats[lats.length - 1],
    south: lats[0],
    east: lons[0],
    west: lons[lons.length - 1]
  }

  res.render('map/map', { title: 'House Map', houses, bounds });
}