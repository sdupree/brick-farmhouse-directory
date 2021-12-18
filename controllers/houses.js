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
  const houses = await House.find({});
  // Check for errors here, some fine day... (check houses.length)
  console.log(houses.length);
  res.render('houses/index', {title: "All Houses", houses});
}

function show(req, res) {
  House.findById(req.params.id).populate('pictures').exec(function (err, house) {
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
  
  // Add User ID into new House object.
  req.body.user = req.user._id;

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

      // Add new Picture back to House and save it.
      house.pictures.push(picture._id);
      house.save(function(err) {
        if (err) {
          console.log(err);
          return res.redirect("/houses/new");
        }

        res.redirect(`/houses/${house._id}`);
      });
    });
  });
}

function edit(req, res) {
  House.findById(req.params.id).populate('pictures').exec(function (err, house) {
    res.render("houses/edit", { title: "Edit House", house });
  });
}

async function update(req, res) {
  const house = await House.findById(req.params.id);
  
  // Delete any empty properties from req.bodye
  for (const key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }
  
  // Update (updatable) house keys from req.body.
  for(const key of ['name', 'location', 'latLon', 'constructionYear', 'archStyle', 'featuredPicture', 'description']) {
    house[key] = req.body[key];
  }

  // Do picture management here?

  // Save house and render.
  house.save(function(err) {
    if (err) {
      console.log(err);
      return res.redirect(`/houses/${house._id}`);
    }

    res.redirect(`/houses/${house._id}`);
  });  
}

function deleteOne(req, res) {
  House.findByIdAndRemove(req.params.id, function(err, result) {
    if(err) console.log(err);
    console.log(result);
    res.redirect('/houses');
  });
}
