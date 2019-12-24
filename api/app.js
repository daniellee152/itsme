const express = require('express');
const morgan = require('morgan');

const app = express();

//////////******* MIDDLEWARE *******//////////
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//////////******* Route *******//////////

module.exports = app;
