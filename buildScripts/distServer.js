import express from 'express';
import path from 'path';
import open from 'open';
import compression from 'compression';

const port = '2000';
const app = express();

/* tell express to serve static files */
app.use(express.static('dist'));
/* enable Gzip compression in express*/
app.use(compression());

/* tell express which route to handle */
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.get('/users', function(req, res){
  // Hard coding for simplicity. Pretend this hits a real database
  res.json([
    {"id":1, "firstName":"Bob", "lastName":"Smith", "email":"bob@gmail.com"},
    {"id":2, "firstName":"Tammy", "lastName":"Norton", "email":"Norton@gmail.com"},
    {"id":3, "firstName":"Tina", "lastName":"Lee", "email":"Lee@gmail.com"}
  ]);
});

/* eslint-disable no-console */
app.listen(port, function(err){
  if (err){
    console.log(err);
  } else {
    open('http://192.168.1.159:'+port);
  }
});
