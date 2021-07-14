// config dotenv
require('dotenv').config()

// import required modules and dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { nanoid } = require('nanoid');
const Url = require('./models/url');
const ejs = require('ejs')
const createHttpError = require('http-errors')

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs')

// Connect to the Database
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })

// routes
app.get('/', (req, res) => {
    return res.render('index')
})

app.post('/', async (req, res) => {
    try {
        const { url } = req.body;
        // check if the url exists in the database
        const exist = await Url.findOne({ url })
        if (exist) {
            return res.render('index', { shorturl: `http://localhost:${port}/${exist.shorturl}` })
        }
        const short = new Url({
            url: url,
            shorturl: nanoid(5)
        })
        const savetoDb = await short.save()
        return res.render('index', { shorturl: `http://localhost:${port}/${savetoDb.shorturl}` })
    } catch (error) {
        res.json({
            error
        })
    }
});

app.get('/:shorturl', async (req, res, next) => {
    try {
        const { shorturl } = req.params;
        const findAndReturn = await Url.findOne({ shorturl }) 

        if(!findAndReturn) {
            throw createHttpError.BadRequest("The shorturl you are looking for does not exist")
        }
        res.redirect(findAndReturn.url)
    } catch (error) {
        next(error)
    }
})

app.use((req, res, next) => {
    next(createHttpError.NotFound())
})
  
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('index', { error: err.message })
})
// Listen to the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})