require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const port = 8080;
const host = 'localhost';

// Connect to MongoDB
connectDB();

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

// middleware fore cookies
app.use(cookieParser());

app.use((_req, res, next) => {
    ['Acces-Control-Allow-Origin', 'Access-Control-ALlow-Methods', 'Access-Controll-Allow-Headers'].forEach(header => res.setHeader(header, '*'));
    next();
});

// routes
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use(verifyJWT);
app.use('/users', require('./routes/api/users'));

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running at http://${host}:${port}`);
    });
});