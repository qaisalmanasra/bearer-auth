'use strict';

// 3rd Party Resources
require('dotenv').config();
const PORT = process.env.PORT || 3001;
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Esoteric Resources
const errorHandler = require('./error-handlers/500.js');
const notFound = require('./error-handlers/404.js');
const authRoutes = require('./auth/router/index.js');
// const signinRouter=require("./auth/router/index");
// const signupRouter=require("./auth/router/index");
// const secretStuffRouters=require("./auth/router/index");
// const getUsersRouter=require("./auth/router/index");

// Prepare the express app
const app = express();
app.get("/",(req,res)=>{
  res.send("Home Page")
})

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRoutes);
// app.use(signinRouter);
// app.use(signupRouter);
// app.use(secretStuffRouters);
// app.use(getUsersRouter);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  startup: (PORT) => {
    app.listen(PORT, () => {
      console.log(`Server Up on ${PORT}`);
    });
  },
};