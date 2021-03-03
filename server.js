
//==================Packages=================

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

//==================App=====================

const app = express();
app.use(cors());



const PORT = process.env.PORT || 3000;

app.use(express.static('./public')); 
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs')

const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL)
client.on('error', err => console.log(err));

//==================Routes===================
app.get('/', (req, res) => {
  res.render('./pages/index.ejs')
});

app.get('/', showCollection);
app.get('./searches/new/:book_id', singleBook);
app.post('./new_search', newSearch);



app.get('/searches', (req, res) => {
  res.render('./pages/searches/new.ejs')

});

function showCollection(req, res){
  const sqlStr = "SELECT * FROM books";
  client.query(sqlStr)
  .then(results => {
    //console.log(results);
    res.render('./pages/index.ejs', {object})
  })
console.log('show collection');
res.render('./pages/searches/new.ejs')
}


function singleBook(req, res){
  console.log('single book');
  res.render('./pages/searches/new.ejs')
}

function newSearch(req, res){
  console.log('single book');
  res.render('./pages/searches/new.ejs')
}





app.post('/searches', (req, res) => {
  //console.log("im searching for", req.body);
  try{
  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=in${req.body.selection}:${req.body.userInput}& limit=10`)
  .then(bookData => {

    console.log("bookData", bookData.body);
    
    const bookCameBack = bookData.body.items.map(outputPrep);

    function outputPrep(info){
      return new Bookbuild(info)
    }
    res.render('pages/searches/show', {bookFront : bookCameBack})
  });
  } catch(error){
    res.render('/pages/error.ejs', {errorThatComesBack : error})
}
})


function Bookbuild(data) {
  this.image_url = data.volumeInfo.imageLinks.thumbnail ? data.volumeInfo.imageLinks.thumbnail : `https://i.imgur.com/J5LVHEL.jpg`;
  this.title = data.volumeInfo.title;
  this.author = data.volumeInfo.authors[0];
  this.description = data.volumeInfo.description;
}

// .catch(errorThatComesBack => {
//   // console.log(errorThatComesBack);
// });

//==================Init====================



  app.listen(PORT, () => console.log(`app is up ${PORT}`));



