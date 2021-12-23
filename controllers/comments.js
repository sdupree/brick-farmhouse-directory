const House = require('../models/house');

module.exports = {
  create,
  delete: deleteComment
};

function create(req, res, next) {
  // Find the house we are commenting on.
  House.findById(req.params.id).then(function(house) {
    // Add user info to req.body.
    console.log(req.user);
    req.body.user = req.user._id;
    req.body.userName = req.user.name;

    // Add Comment to House, and save House.
    house.comments.push(req.body);
    house.save().then(function() {
      // Return to house's detail page.
      res.redirect(`/houses/${house._id}`);
    }).catch(function(err) {
      return next(err);
    });
  });
}

function deleteComment(req, res, next) {
  House.findOne({'comments._id': req.params.id}).then(function(house) {
    
    // Ensure that the comment was created by the logged in user.
    if (!house.user.equals(req.user._id)) return res.redirect(`/houses/${house._id}`);

    // Delete Comment and save House.
    house.comments.id(req.params.id).remove();
    house.save().then(function() {
      // Return to house's detail page.
      res.redirect(`/houses/${house._id}`);
    }).catch(function(err) {
      return next(err);
    });
  });
}