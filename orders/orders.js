const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');

//middleware
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://marketing:grGtDSinJW0IAcRl@cluster0-piwe1.mongodb.net/orders?retryWrites=true&w=majority', { useNewUrlParser: true }, () => {
    console.log('Database is connected, order services');
});

//load model
const Order = require('./Order');

//will create a new order
app.post('/order', (req, res) => {
    const newOrder = {
        CustomerID: mongoose.Types.ObjectId(req.body.CustomerID),
        BookID: mongoose.Types.ObjectId(req.body.BookID),                    
        initialDate: req.body.initialDate,
        deliveryDate: req.body.deliveryDate
    }

    const order = new Order(newOrder)

    order.save().then( () => {
        res.send('order created successfully')
    }).catch(err => {
        if(err) throw err;
    })

});

app.get('/orders', (req, res) => {
    Order.find().then( orders => {
        res.json(orders);
    }).catch(err => {
        if(err) throw err;
    })
});

app.get('/order/:id', (req, res) => {

    Order.findById(req.params.id).then( order => {
        if(order){

            axios.get('http://localhost:5555/customer/' + order.CustomerID).then(response => {
                
                let ObjectOrder = {customerName: response.data.name, bookTitle: ''};

                axios.get('http://localhost:4545/book/' + order.BookID).then( response => {

                    ObjectOrder.bookTitle = response.data.title
                    res.json(ObjectOrder)

                })

            })


        }else {
            res.send('invalid Order')
        }
    })

});

app.listen(7777, () => {
    console.log('App is listening on port 7777, orders');
});