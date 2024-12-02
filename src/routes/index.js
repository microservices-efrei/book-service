const express = require('express');

const bookRoutes = require('./bookRoutes');

const app = express();

app.use('/books', bookRoutes);

module.exports = app;
