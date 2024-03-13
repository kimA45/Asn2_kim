const exphbs = require('express-handlebars')

const express = require('express');
const path = require('path');
const fs = require("fs"); //read and process the datasetB.json file
const app = express();

const port = process.env.port || 3000; 


//configuring handlebars and helpers
const hbs = exphbs.create({
    extname: '.hbs',
    helpers: {
        isEqual: function (a, b, opts) {
            // Use 'inverse' as a function if it exists
            if (opts.inverse && typeof opts.inverse === 'function') {
                return a === b ? opts.fn(this) : opts.inverse(this);
            }

            // If 'inverse' is not a function, handle it as a string
            return a === b ? (opts.fn ? opts.fn(this) : '') : '';
        },
        replaceZeroReviews: function (reviews) {
            return reviews === 0 ? 'N/A' : reviews;
        },
        //new helper
        notEqual: function (a, b, opts) {
            // Use 'inverse' as a function if it exists
            if (opts.inverse && typeof opts.inverse === 'function') {
                return a !== b ? opts.fn(this) : opts.inverse(this);
            }

            // If 'inverse' is not a function, handle it as a string
            return a !== b ? (opts.fn ? opts.fn(this) : '') : '';
        },
    }
});

//engine
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

//setting directories paths connection for access
app.set('views', path.join(__dirname, 'views')); //sets views directory path
app.use(express.static(path.join(__dirname, 'public'))); //serves static files from public directory
app.use(express.urlencoded({ extended: true }));

// Loading JSON data
const jsonData = require('./datasetB.json');  //assigned to jsonData Variable

//url patters declared Step 1 - 5
app.get('/', function(req, res) {
  //res.render('partials/index', { title: 'Express' }); //step 1 - 4
  //res.render('partials/index', { title: 'Kims Web App' });  //removed title name for step 5
  res.render('partials/index', { title: 'Kim - N01525911' }); //Changed title to Kim-StdID for step 6
});

app.get('/users', function(req, res) {
  res.send('respond with a resource');
});



//Step 6 - Updated Routes from Assignment 1 code
//1.
app.get('/data', (req, res) => {
    res.render('partials/msg', { msg : ' ' }); // we can use render or send to display on browser , file msg.hbs is called
    //res.send('JSON data is loaded and ready!');
    console.log('JSON data is loaded and ready!')  //when route is encountered sends a mesage to terminal 
    console.log('Loaded JSON data:', jsonData);  //displays contents of file to console

}); //shows message that the JSON data is loaded. 

//2. 
//.hbs files created in views/partials directory which contains form body
app.get('/data/product/:id', (req, res) => {
    const id = req.params.id;
    const product = jsonData.find(item => item.asin === id);

    if (product) {
        res.send(`Product Info: ${JSON.stringify(product)}`);
    } else {
        res.status(404).send('Value not found');
    }
}); //takes the values passed in :id , and if the value matches a vaues of 'asin' in the data set it the corresponding record is displayed on browser. 


//3. 
app.get('/data/search/prdID', (req, res) => {
    res.render('partials/id.hbs');
}); 

// Handeling the form post for /data/search/prdID'
app.post('/data/search/prdID', (req, res) => {
    const productId = req.body.product_id;
    const product = jsonData.find(item => item.asin === productId);

    if (product) {
        res.send(`Product Info: ${JSON.stringify(product)}`);
    } else {
        res.status(404).send('Product not found');
    }
});

//4.
app.get('/data/search/prdName', (req, res) => {
    res.render('partials/name.hbs');
});

    // Handeling the form post for /data/search/prdName'
app.post('/data/search/prdName', (req, res) => {
    const pdtName = req.body.product_name.toLowerCase();
    const matchingProducts = jsonData.filter(item => item.title.toLowerCase().includes(pdtName));

    if (matchingProducts.length > 0) {
        const displayInfo = matchingProducts.map(product => ({
            category: product.categoryName,
            actual_price: product.price,
            rating: product.stars,
        }));

        res.send(`Matching Products: ${JSON.stringify(displayInfo)}`);
    } else {
        res.status(404).send('No matching products found');
    }
});


//STEP 7 - /allData Route
// Step 7 - Rename the route
app.get('/allData', (req, res) => {
    res.render('partials/display', { products: jsonData });
});


//Assignment 2
app.get('*', function(req, res) {
    res.render('partials/error', { title: 'Error', message: 'Wrong Route' });
  }); //using handlebars to send wrong route error message

//Assignmnet 1
/*app.use((req, res) => {
      res.status(404).send('Route not found');
  });  //using error handeling to handle wrong route message */



//specift port and env. variable 
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
