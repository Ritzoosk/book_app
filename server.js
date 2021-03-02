
//==================Packages=================

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

//==================App=====================

const app = express();
app.use(cors());
//const client = new pg.Client(process.env.DATABASE_URL)

// client.on('error', err => console.log(err));

const PORT = process.env.PORT || 3000;

app.use(express.static('./public')); 
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs')

//==================Routes===================

app.get('/searches', (req, res) => {
  res.render('./pages/searches/new.ejs')

});

// function getHome (req, res) {
//     res.render('pages/index');
// }

app.post('/searches', (req, res) => {
  console.log("im searching for", req.body);

  superagent.get(`https://www.googleapis.com/books/v1/volumes?q=in${req.body.selection}:${req.body.userInput}& limit=10`)
  .then(bookData => {

    console.log("bookData", bookData);
    
    const bookCameBack = data.body.items.map(outputPrep);

    function outputPrep(info){
      return new Bookbuild(info)
    }

  });


})

//==================Init====================



  app.listen(PORT, () => console.log(`app is up ${PORT}`));



