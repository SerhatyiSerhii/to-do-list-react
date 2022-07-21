const express = require('express');
const cors = require('cors');
const app = express();
const errorHandler = require('./middleware/errorHandler');
const port = 8080;
const host = 'localhost';

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.use(cors());

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use((_req, res, next) => {
    ['Acces-Control-Allow-Origin', 'Access-Control-ALlow-Methods', 'Access-COntroll-Allow-Headers'].forEach(header => res.setHeader(header, '*'));
    next();
});

// routes
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/api/users'));

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running at http://${host}:${port}`);
});