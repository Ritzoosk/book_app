
//==================Packages=================

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

//==================App=====================

const app = express();
app.use(cors());
const methodOverride = require('method-override');


const PORT = process.env.PORT || 3000;
app.use(methodOverride('_method'));
app.use(express.static('/public')); 
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs')

const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL)
client.on('error', err => console.log(err));

//==================Routes===================

app.get('/', getHomePage);
app.get('/books/:id', singleBook)
app.post('/searches', newSearch);
app.get('/searches', getSearchPage);
app.post('/books', svBook);


app.delete('/books/:id');



//=====================HOME=================

function getHomePage(req, res){
  const sqlStr = "SELECT * FROM books";
  client.query(sqlStr)
  .then(results => {
    // console.log(results);
    res.render('pages/index.ejs', {collection : results.rows, rowCount : results.rowCount});
  })
}

///////////SEARCH

function getSearchPage(req, res){
  //console.log('newSearch');


  res.render('pages/searches/new.ejs')
}


function singleBook(req, res){
  const sqlStr = "SELECT * FROM books WHERE id=$1";
  const sqlValue = [req.params.id]
  client.query(sqlStr, sqlValue)
  .then(results =>{
    res.render('pages/books/details.ejs', {book : results.rows[0]});
  });
  
}

function newSearch(req, res){
  console.log('newSearch', req.body);
  try{
    superagent.get(`https://www.googleapis.com/books/v1/volumes?q=in${req.body.selection}:${req.body.userInput}& limit=10`)
    .then(bookData => {
  
      //console.log("bookData", bookData.body);
      
      const bookCameBack = bookData.body.items.map(outputPrep);
      function outputPrep(info){
        return new Bookbuild(info)
      }
      res.render('pages/searches/show', {bookFront : bookCameBack})
    });
    } catch(error){
      res.render('pages/error.ejs', {errorThatComesBack : error})
  }
  
}

//////////////SAVE

function svBook(req, res){
const sqlQueryStr = 'INSERT INTO books (title, description, author, image_url) VALUES ($1, $2, $3, $4) RETURNING id';
const sqlArr = [req.body.title, req.body.description, req.body.author,  req.body.image_url]
client.query(sqlQueryStr, sqlArr)
  .then(results => {
    res.redirect(`/books/${results.rows[0].id}`)
  });



};


/////////////DELETE

function deleteBook(req, res){
  const selectedBook = req.params.id;
  let sqlString = 'DELET FROM task WHERE id=$1;';
  let sqlArray = [id];
  client.query(sqlString, sqlArray)
  return client.query(sqlString, sqlArray)
  .then(() => {
    res.redirect('/');

  });
}

//////////UPDATE

function updateBooks(req, res){
  const {title, author, isbn, image_url, description} = req.body;
  const{id} = req.params;
  let sqlArray = [id, title, description, author, isbn, image_url];
  let sqlString = 'UPDATE books SET title=$2, description=$3, author=$4, image_url=$6 WHERE id=$1;';
  client.query(sqlString, sqlArray)
  .then(() => {
    res.send(`/books/${id}`);
  });
}




function Bookbuild(data) {
  this.image_url = data.volumeInfo.imageLinks.thumbnail ? data.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
  this.title = data.volumeInfo.title;
  this.author = data.volumeInfo.authors[0];
  this.description = data.volumeInfo.description;
}


//==================Init====================


client.connect().then(() => {

  app.listen(PORT, () => console.log(`up on http://localhost:${PORT}`));
});


