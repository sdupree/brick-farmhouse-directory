const House = require('../models/house');
const Picture = require('../models/picture');

module.exports = {
  home,
  index,
  show,
  new: newHouse,
  create,
  edit,
  update,
  delete: deleteOne
};

async function home(req, res) {
  const house = await House.findOne({ isFeatured: true }).populate('pictures').exec();
  res.render('home', { title: 'Brick Farmhouse Directory', house });
}

async function index(req, res) {
  const houses = await House.find({}).sort({createdAt: 'asc'});  // I assume "sort({createdAt: 'asc'})" is actually the default, but let's be explicit.
  res.render('houses/index', { title: 'All Houses', houses });
}

async function show(req, res) {
  const house = await House.findById(req.params.id).populate('pictures').exec();
  res.render('houses/show', { title: 'House Detail', house });
}

function newHouse(req, res) {
  res.render('houses/new', { title: 'Add House' });
}

async function create(req, res, next) {
  try {
    // Delete empty properties from req.body.
    for (let key in req.body) { if (req.body[key] === '') delete req.body[key]; }
    
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

    // Insert our house into the Linked List.
    const navs = await updateLinkedList(house, 'add');
    for(const key of ['prevHouse', 'nextHouse']) {
      // Assign nextHouse and prevHouse for nav buttons.
      house[key] = navs[key];
    }
    
    // Add new Picture back to House and save it.
    house.pictures.push(picture._id);
    await house.save();

    res.redirect(`/houses/${house._id}`);
  } catch(e) {
    console.log(e);
    res.redirect('/houses/new');
  }
}

function edit(req, res) {
  House.findById(req.params.id).populate('pictures').exec(function (err, house) {
    res.render('houses/edit', { title: 'Edit House', house });
  });
}

async function update(req, res) {
  try {
    // Get house.
    const house = await House.findById(req.params.id);
    
    // Delete any empty properties from req.body.
    for (const key in req.body) { if (req.body[key] === '') delete req.body[key]; }
    
    // Update (updatable) house keys from req.body.
    for(const key of ['name', 'location', 'latLon', 'constructionYear', 'archStyle', 'featuredPicture', 'description']) {
      house[key] = req.body[key];
    }

    // Save house.
    await house.save();

    res.redirect(`/houses/${house._id}`);
  } catch(e) {
    console.log(e);
    res.redirect(`/houses/${house._id}/edit`);
  }
}

async function deleteOne(req, res) {
  try {
    // Remove our house from the Linked List.
    await updateLinkedList({_id: req.params.id}, 'delete');
    
    // Delete house.
    const result = await House.findByIdAndRemove(req.params.id);
    
    res.redirect('/houses');
  } catch(e) {
    console.log(e);
    res.redirect('/houses');
  }
}

async function updateLinkedList(house, mode) {
  // Give us a house and a mode ("add"/"delete"). We'll update the neighboring elements, and return their IDs.
  const houses = await House.find({}).sort({createdAt: 'asc'});
  let prevHouse = '';
  let nextHouse = '';
  for(const idx in houses) {
    if(houses[idx]._id.equals(house._id)) {
      const pos = parseInt(idx) + 1;  // CURSE YOU, 0-INDEXED ARRAYS.  DOUBLE-CURSE YOU, STRING CONCATENATION ON NOT-QUITE-INTEGERS.
      pos == 1 ? prevHouse = houses[houses.length - 1]._id : prevHouse = houses[parseInt(idx) - 1]._id;
      pos == houses.length ? nextHouse = houses[0]._id : nextHouse = houses[parseInt(idx) + 1]._id;
      break;
    }
  }

  if(mode === 'add') {
    // Insert our house between the "previous" and "next" houses.
    await House.findOneAndUpdate({_id: prevHouse}, {nextHouse: house._id});
    await House.findOneAndUpdate({_id: nextHouse}, {prevHouse: house._id});
  } else if(mode === 'delete') {
    // Skip our house; we're deleting it.
    await House.findOneAndUpdate({_id: prevHouse}, {nextHouse: nextHouse});
    await House.findOneAndUpdate({_id: nextHouse}, {prevHouse: prevHouse});
  }

  return {prevHouse, nextHouse};
}