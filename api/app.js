const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const app = express();

//////////******* MIDDLEWARE *******//////////
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//////////******* Route *******//////////
app.use('/api/v1/users', userRouter);

module.exports = app;
