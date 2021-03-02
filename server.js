
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

app.get('/', getHello);

function getHello (req, res) {
    res.render('pages/index');
}

// app.get('/', (req, res) =>{


// });

//==================Init====================



  app.listen(PORT, () => console.log(`app is up ${PORT}`));



