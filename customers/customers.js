const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//middleware
app.use(bodyParser.json());

const mongoose = require('mongoose');

//require customer models
const Customer = require('./Customer');

//connect to database
mongoose.connect('mongodb+srv://marketing:grGtDSinJW0IAcRl@cluster0-piwe1.mongodb.net/customers?retryWrites=true&w=majority', { useNewUrlParser: true }, () => {
    console.log('Database is connected, customer services');
});

app.get('/', (req, res) => {
    res.send('customers home');
})

//create - add customer
app.post('/customer', (req, res) => {
    const newCustomer = {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address
    }
    //create new book
    const customer = new Customer(newCustomer);

    customer.save()
    .then( () => {
        console.log('new customer saved')
    }).catch(err => {
        if(err) throw err;
    });

    res.send('customer successfully saved');

});

//get all customers
app.get('/customers', (req, res) => {
    Customer.find().then( customer => {
        res.json(customer);
    }).catch(err => {
        if(err) throw err;
    })
});

//get customer by id
app.get('/customer/:id', (req, res) => {
    Customer.findById( req.params.id)
        .then( customer => {
            if(customer) {
                res.json(customer);
            }else {
                res.sendStatus(404);
            }
        }).catch(err => {
            if(err) throw err;
        });
});

//delete customer
app.delete('/customer/:id', (req, res) => {
    Customer.findByIdAndDelete(req.params.id)
        .then( customer => {
            res.json("Customer deleted");
        }).catch(err => {
            if(err) throw err;
        });
});




app.listen(5555, () => {
    console.log('app is listening to port 5555');
})