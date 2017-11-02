const express = require('express');
const stripe = require('stripe')('sk_test_EvdOdYBzpB9l6obmufxzgOYz');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Set Static Folder
app.use(express.static(`${__dirname}/public`));

// Index Route
app.get('/', (req, res) => {
    res.render('index');
});

//app.get('/success', (req, res) => {
//    res.render('success');
//});


// Charge Route
app.post('/charge', (req, res) => {
    const amount = 2500;
    // to find out what form sends     //console.log(req.body);     //res.send('TEST');

    // Create a new customer and then a new charge for that customer:
    stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        })
        .then(customer => stripe.charges.create({
            amount,
            description: 'Web Development Ebook',
            currency: 'usd',
            customer: customer.id
        }))
        .then(charge => res.render('success'));

});


// heroku || local
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});