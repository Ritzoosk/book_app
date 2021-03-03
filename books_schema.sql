DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  img VARCHAR(255),
  title VARCHAR(255),
  author VARCHAR(255),
  book_description VARCHAR(255)
)