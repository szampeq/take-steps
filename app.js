const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const axios = require('axios');
//const PORT = process.env.PORT || 5000

dotenv.config({path: './.env'})

const app = express();

const db = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.set('view-engine', 'hbs');

db.getConnection( (error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("MySQL connected.")
    }
})

// Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(3000, () => {
    console.log("Server started");
})