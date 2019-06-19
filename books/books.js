const express = require('express');
const app = express();
const bodyParser = require('body-parser');


//middleware
app.use(bodyParser.json());

//require model book
const Book = require('./book');

//load mongoose
const mongoose = require('mongoose');
//connect to mongoose
mongoose.connect('mongodb+srv://marketing:grGtDSinJW0IAcRl@cluster0-piwe1.mongodb.net/books?retryWrites=true&w=majority', { useNewUrlParser: true }, () => {
    console.log('Database is connected, books');
});



app.get('/', (req, res) => {
    res.send('this is our main endpoint');
});

//add book
app.post('/book', (req, res) => {
    const newBook = {
        title: req.body.title,
        author: req.body.author,
        numberPages: req.body.numberPages,
        publisher: req.body.publisher
    }
    //Create a new book
    const book = new Book(newBook)

    book.save()
    .then(() => {
        console.log('New book created')
    }).catch((err) => {
        if(err) throw err;
    })
    res.send("a new book created successfully")
});

//get all books
app.get('/books', (req, res) => {
    Book.find().then( books => {
        res.json(books)
    }).catch(err => {
        if(err) throw err;
    });
});

//get book by id
app.get('/book/:id', (req, res) => {
    Book.findById(req.params.id)
    .then(book => {

        if(book) {
            res.json(book)
        }else{
            res.sendStatus(404)
        }

    }).catch(err => {
        if(err) throw err;
    })
});

//delete book
app.delete('/book/:id', (req, res) => {
    Book.findByIdAndDelete(req.params.id)
        .then( book => {
            res.json("Book deleted")
        }).catch(err => {
            if(err) throw err;
        })
});


app.listen(4545, () => {
    console.log('Up and running! -- this is our books store');
});
