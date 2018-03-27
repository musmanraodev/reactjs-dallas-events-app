const db = require("../db/config");

const favoriteModel = {};

favoriteModel.findAll = () => {
  return db.query(`SELECT * FROM userdata ORDER BY id ASC`);
};

favoriteModel.findFavByUserId = item => {
  return db.query(`SELECT *, events.item_id AS id
  FROM (events
  INNER JOIN favorites ON events.item_id = favorites.events_ref_item_id)
  WHERE
  favorites.user_ref_id = $1
  `, [item.user_id]);
};



favoriteModel.create = item => {
  return db.one(
    ` 
      INSERT INTO events (item_id, name, yes_rsvp_count, local_date, address_1, address_2, city, country, description, link)
      SELECT * FROM (SELECT $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) AS tmp 
      WHERE NOT EXISTS (
          SELECT item_id FROM events WHERE item_id = $2
      );
   
      INSERT INTO favorites (events_ref_item_id, user_ref_id)
      SELECT * FROM (SELECT $2, $1) AS tmp 
      WHERE NOT EXISTS (
          SELECT * FROM favorites WHERE events_ref_item_id = $2 AND user_ref_id = $1
      );
      
      SELECT * FROM events WHERE item_id = $2;
    `,
    [
      item.user_id,
      item.item_id,
      item.name,
      item.yes_rsvp_count,
      item.local_date,
      item.address_1,
      item.address_2,
      item.city,
      item.country,
      item.description,
      item.link
    ]
  );
};

favoriteModel.destroy = data => {
  return db.none(
    `
      DELETE FROM favorites
      WHERE events_ref_item_id = $1 AND user_ref_id = $2;
      DELETE FROM events
        WHERE item_id NOT IN (SELECT favorites.events_ref_item_id 
                        FROM favorites);
    `,
    [data.item_id, data.userId]
  );
};

module.exports = favoriteModel;
