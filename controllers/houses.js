const House = require("../models/house");
const Picture = require('../models/picture');

module.exports = {
  index,
  show,
  new: newHouse,
  create,
  edit,
  update,
  delete: deleteOne
};

async function index(req, res) {
  const houses = await House.find({}).sort({createdAt: 'asc'});  // I assume "sort({createdAt: 'asc'})" is actually the default, but let's be explicit.
  console.log(houses);
  res.render('houses/index', {title: "All Houses", houses});
}

async function show(req, res) {
  const house = await House.findById(req.params.id).populate('pictures').exec();
  res.render("houses/show", { title: "House Detail", house });
}

function newHouse(req, res) {
  res.render("houses/new", { title: "Add House" });
}

async function create(req, res, next) {
  try {
    // Delete empty properties from req.body.
    for (let key in req.body) { if (req.body[key] === "") delete req.body[key]; }
    
    // Make new House object and save it.
    req.body.user = req.user._id;
    const house = new House(req.body);
    await house.save();

    // Save default picture as first 'Picture'.
    const picture = new Picture({
      URI: req.body.featuredPicture,
      house: house._id,
      user: req.user._id
    });
    await picture.save();

    // Add new Picture back to House and save it.
    house.pictures.push(picture._id);
    await house.save();

    res.redirect(`/houses/${house._id}`);
  } catch(e) {
    console.log(e);
    // res.redirect('/houses/new');
  }
}

function edit(req, res) {
  House.findById(req.params.id).populate('pictures').exec(function (err, house) {
    res.render('houses/edit', { title: 'Edit House', house });
  });
}

async function update(req, res) {
  try {
    const house = await House.findById(req.params.id);
    
    // Delete any empty properties from req.body.
    for (const key in req.body) { if (req.body[key] === '') delete req.body[key]; }
    
    // Update (updatable) house keys from req.body.
    for(const key of ['name', 'location', 'latLon', 'constructionYear', 'archStyle', 'featuredPicture', 'description']) {
      house[key] = req.body[key];
    }

    // Get nextHouse and prevHouse for nav buttons.
    const navs = await getNextAndPrevHouses(house);
    console.log(navs);
    house.prevHouse = navs.prevHouse;
    house.nextHouse = navs.nextHouse;

    // Save house.
    await house.save();

    res.redirect(`/houses/${house._id}`);
  } catch(e) {
    console.log(e);
    res.redirect(`/houses/${house._id}/edit`);
  }
}

function deleteOne(req, res) {
  House.findByIdAndRemove(req.params.id, function(err, result) {
    if(err) console.log(err);
    console.log(result);
    res.redirect('/houses');
  });
}

async function getNextAndPrevHouses(house) {
  // Give us a house and we'll tell you which ones are ahead of it and behind it in the house index.
  // It's a Linked List!
  const houses = await House.find({}).sort({createdAt: 'asc'});
  console.log('house count: ' + houses.length);
  let prevHouse = '';
  let nextHouse = '';
  for(const idx in houses) {
    if(houses[idx]._id.equals(house._id)) {
      const pos = parseInt(idx) + 1;  // CURSE YOU, 0-INDEXED ARRAYS.  DOUBLE-CURSE YOU, STRING ADDITION ON NOT-QUITE-INTEGERS.
      console.log(houses[idx]._id + ' ' + house._id + ' ' + pos + ' ' + houses.length);
      pos == 1 ? prevHouse = houses[houses.length - 1]._id : prevHouse = houses[parseInt(idx) - 1]._id;
      pos == houses.length ? nextHouse = houses[0]._id : nextHouse = houses[parseInt(idx) + 1]._id;
      break;
    }
  }
  return {prevHouse, nextHouse};
}