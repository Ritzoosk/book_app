DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  image_url TEXT,
  title VARCHAR(255),
  author VARCHAR(255),
  description TEXT
)