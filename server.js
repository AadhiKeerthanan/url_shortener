// config dotenv
require('dotenv').config()

// import required modules and dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { nanoid } = require('nanoid');
const Url = require('./models/url');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to the Database
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true })

// routes

// Listen to the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})