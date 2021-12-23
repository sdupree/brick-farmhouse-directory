const House = require('../models/house');

module.exports = { map };

async function map(req, res) {
  const houses = await House.find({});
  res.locals.page = 'map';

  const lats = [];
  const lons = [];
  for(house of houses) {
    const latLon = house.latLon.split(',');
    lats.push(parseFloat(latLon[0]));
    lons.push(parseFloat(latLon[1]));
  }
  lats.sort();
  lons.sort();
  const bounds = {
    north: lats[lats.length - 1],
    south: lats[0],
    east: lons[0],
    west: lons[lons.length - 1]
  }

  // console.log(lats);
  // console.log(lons);

  res.render('map/map', { title: 'House Map', houses, bounds });
}