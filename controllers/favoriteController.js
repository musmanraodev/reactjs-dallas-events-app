const favoriteModel = require("../models/favoriteModel");

const favoriteController = {};

favoriteController.show = (req, res) => {
  favoriteModel.findFavByUserId({
    user_id: req.body.user_id,
  })
    .then(item => {
      let obj = {};
      item.forEach(e => obj[e.id] = e)
      res.json({
        message: "ok",
        data: {
          data: obj
        }
      });
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

favoriteController.create = (req, res) => {
  favoriteModel.create({
    item_id: req.body.item_id,
    name: req.body.name,
    local_date: req.body.local_date,
    user_id: Number(req.body.user_id),
    yes_rsvp_count: Number(req.body.yes_rsvp_count),
    address_1: req.body.address_1,
    address_2: req.body.address_2,
    city: req.body.city,
    country: req.body.country,
    description: req.body.description,
    link: req.body.link,
  })
    .then(data => {
      res.json({
        message: "ok",
        data: {
          data
        }
      });
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

favoriteController.destroy = (req, res) => {
  favoriteModel.destroy({
    item_id: req.body.item_id,
    userId: Number(req.body.user_id),
  })
    .then(response => {
      res.json({
        message: "item deleted successfully"
      });
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

module.exports = favoriteController;