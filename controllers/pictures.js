const House = require("../models/house");
const Picture = require('../models/picture');

module.exports = {
  create,
  delete: deleteOne
};

async function create(req, res) {
  const house_id = req.params.id;

  // Get existing House object.
  const house = await House.findById(house_id);

  // Delete any empty properties from req.body.
  for(const key in req.body) {
    if(req.body[key] === '') delete req.body[key];
  }
  
  // Add User ID and House ID into new Picture object.
  req.body.user = req.user._id;
  req.body.house = house_id;

  // Save new Picture object.
  const picture = new Picture(req.body);
  picture.save(function (err) {
    // Rudimentary error handling.
    if (err) {
      console.log(err);
      return res.redirect(`/houses/${house_id}`);
    }

    // Add new Picture to House and save it.
    house.pictures.push(picture._id);
    house.save(function(err) {
      if (err) {
        console.log(err);
        return res.redirect(`/houses/${house_id}`);
      }

      res.redirect(`/houses/${house_id}`);
    });
  });
}

function deleteOne(req, res) {
  Picture.findByIdAndRemove(req.params.id, function(err, result) {
    if(err) console.log(err);
    House.findById(result.house, function(err, house) {
      // Remove picture from House's list of pictures, too.
      house.pictures = house.pictures.filter(picture => picture._id !== req.params.id);
      house.save(function(err) {
        if(err) console.log(err);
        res.redirect(`/houses/${house._id}`);
      });
    });
  });
}
