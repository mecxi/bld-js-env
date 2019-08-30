import express from 'express';
import path from 'path';
import open from 'open';
import webpack from 'webpack';
import config from '../webpack.config.dev';

const port = '2000';
const app = express();
const compiler = webpack(config);

/* tell express to use webpack */
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

/* tell express which route to handle */
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

/* eslint-disable no-console */

app.listen(port, function(err){
  if (err){
    console.log(err);
  } else {
    open('http://192.168.1.159:'+port);
  }
});
