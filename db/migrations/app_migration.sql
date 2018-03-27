-- \connect reactjs_dallas_events;

DROP TABLE favorites;
DROP TABLE users;
DROP TABLE events;

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  password TEXT UNIQUE NOT NULL
);

CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  item_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(1024),
  yes_rsvp_count INTEGER,
  local_date VARCHAR(300),
  address_1 VARCHAR(255),
  address_2 VARCHAR(255),
  city VARCHAR(255),
  country VARCHAR(255),
  description TEXT,
  link VARCHAR(1024)
);

CREATE TABLE favorites (
  id BIGSERIAL PRIMARY KEY,
  events_ref_item_id VARCHAR(255) REFERENCES events(item_id),
  user_ref_id INTEGER REFERENCES users(id)
);


