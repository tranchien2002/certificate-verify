const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

require('dotenv').config();

// set up mongodb
mongoose.connect(
  process.env.MONGODB_URI,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => {
    console.log('connected to mongo db');
  }
);

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: '*', // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // allow session cookie from browser to pass through
  })
);

// Set up routes
app.use('/auth', authRoutes);

app.get('/', async (req, res) => {
  res.json({
    hello: 'world'
  });
});

module.exports = app;
