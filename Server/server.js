var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();


// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
 
// parse application/json 
app.use(bodyParser.json({limit: '50mb'}));


var port = process.env.PORT || 8000;

require('./config/routes.js')(app, express);

// starting server
//============================================
app.listen(port, function(err) {
  if (err) {
    console.log(err);
  }
  console.log('Server is functional, Frantic-Rust is on port: ' + port);
});

module.exports = app;
