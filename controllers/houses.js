const House = require("../models/house");
const Picture = require('../models/picture');

module.exports = {
  index,
  show,
  new: newHouse,
  create,
};

async function index(req, res) {
  const houses = await House.find({});
  // Check for errors here, some fine day... (check houses.length)
  console.log(houses.length);
  res.render('houses/index', {title: "All Houses", houses});
}

function show(req, res) {
  House.findById(req.params.id).populate('pictures').exec(function (err, house) {
    console.log(house);
    res.render("houses/show", { title: "House Detail", house });
  });
}

function newHouse(req, res) {
  res.render("houses/new", { title: "Add House" });
}

function create(req, res) {
  // delete any empty properties from req.body
  for (let key in req.body) {
    if (req.body[key] === "") delete req.body[key];
  }
  const house = new House(req.body);
  house.save(function (err) {
    // Rudimentary error handling.
    if (err) {
      console.log(err);
      return res.redirect("/houses/new");
    }
    // Save default picture as first 'Picture'.
    const picture = new Picture({
      URI: req.body.featuredPicture,
      house: house._id,
      user: res.locals.user._id
    });
    picture.save(function(err) {
      if (err) {
        console.log(err);
        return res.redirect("/houses/new");
      }
  
      res.redirect(`/houses/${house._id}`);
    });
  });
}
